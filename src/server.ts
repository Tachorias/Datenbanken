import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import session from 'express-session';
import { join } from 'node:path';
import { createConnection, ResultSetHeader } from 'mysql2';
import { renameSync } from 'node:fs';
import multer from 'multer';
import bcrypt from 'bcryptjs';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();

app.use(express.json());

app.use(session({
  secret: 'filmwebsite-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000*60*60*24
  }
}));

/*// Ordner Upload-Dateien*/
const titelbildOrdner = join(process.cwd(), 'src', 'assets', 'titelbild');
const filmOrdner = join(process.cwd(), 'src', 'assets', 'filme');
const tempOrdner = join(process.cwd(), 'uploads', 'temp');

/*// temporäres Speichern*/
const upload = multer({
  dest: tempOrdner,
});

/*// Damit Datein erreichbar im Browser*/
app.use('/assets', express.static(join(process.cwd(), 'src', 'assets')));
const angularApp = new AngularNodeAppEngine();
var con = createConnection({
  host: "192.168.110.94",
  user: "26_DB_Grp5",
  password: "0CqWrDxDlDXsJugpu4rf",
  database: "26_DB_Gruppe5",
  ssl:{rejectUnauthorized: false}
});

/*// Kategorie filtern*/
app.get('/api/movies/filter/kategorien', (req, res) => {
  const idsText = String(req.query['ids'] || '');
  const sortierungText = String(req.query['sortierung'] || 'neu');
  const suchtext = String(req.query['suche'] || '').trim();

  const sortierung = sortierungText === 'alt' ? 'ASC' : 'DESC';
  const suchmuster = `%${suchtext}%`;

  const ids = idsText
    .split(',')
    .map(id => Number(id))
    .filter(id => id > 0);

  let sql = `
    SELECT f.* FROM Filme f WHERE (
      ? = ''
      OR LOWER(f.Titel) LIKE LOWER(?)
      OR EXISTS (
        SELECT 1
        FROM Filmverwaltung fv
        JOIN Produzenten p
          ON p.Nutzername = fv.Produzent
        WHERE fv.idFilm = f.idFilme
          AND LOWER(p.Anzeigename) LIKE LOWER(?)
      )
    )
  `;

  const werte: Array<string | number> = [
    suchtext,
    suchmuster,
    suchmuster
  ];

  if (ids.length > 0) {
    const platzhalter = ids.map(() => '?').join(', ');

    sql += `
      AND f.idFilme IN (
        SELECT kv.idFilm
        FROM Kategorieverwaltung kv
        WHERE kv.idKategorie IN (${platzhalter})
        GROUP BY kv.idFilm
        HAVING COUNT(DISTINCT kv.idKategorie) = ?
      )
    `;

    werte.push(...ids, ids.length);
  }

  sql += `
    ORDER BY f.UploadDatum ${sortierung},
             f.idFilme ${sortierung}
  `;

  con.query(sql, werte, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Fehler bei der Filmsuche');
    } else {
      res.json(result);
    }
  });
});

/*// Kategorien*/
app.get('/api/kategorien', (req, res) => {
  con.query('SELECT * FROM Kategorien ORDER BY Name ASC', (err, result) => {
    if (err) {
      res.status(500).send('Error fetching categories');
    } else {
      res.json(result);
    }
  });
});


/*// Lädt Filme nach Datum sortiert*/
app.get('/api/movies/neu', (req, res) => {
  con.query('SELECT * FROM Filme ORDER BY UploadDatum DESC, idFilme DESC', (err, result) => {
    if (err) {
      res.status(500).send('Error fetching movies');
    } else {
      res.json(result);
    }
  });
});

/*// Lädt älteste Filme zuerst*/
app.get('/api/movies/alt', (req, res) => {
  con.query('SELECT * FROM Filme ORDER BY UploadDatum ASC, idFilme ASC', (err, result) => {
    if (err) {
      res.status(500).send('Error fetching movies');
    } else {
      res.json(result);
    }
  });
});

app.get('/api/movies', (req, res) => {
  con.query("SELECT * FROM Filme", (err, result) => {
    if (err) {
      res.status(500).send('Error fetching movies');
    } else {
      res.json(result);
    }
  });
})

app.get('/api/movies/likes', (req, res) => {
  con.query('SELECT f.idFilme, f.Titel, f.Beschreibung, COUNT(l.idFilm) AS anzahl_likes ' +
    'FROM Filme f ' +
    'LEFT JOIN Likes l ON f.idFilme = l.idFilm ' +
    'GROUP BY f.idFilme, f.Titel, f.Beschreibung '+
    'ORDER BY anzahl_likes DESC', (err, result) => {
    if (err) {
      res.status(500).send('Error fetching movies');
    } else {
      res.json(result);
    }
  });
})
app.get('/api/movies/search/:id', (req, res) => {
  const sql = `
    SELECT
      f.*,
      p.Anzeigename,
      COUNT(l.Nutzer) AS Likes
    FROM Filme f
           LEFT JOIN Likes l
                     ON f.idFilme = l.idFilm
           JOIN Filmverwaltung fv
                ON fv.idFilm = f.idFilme
           JOIN Produzenten p
                ON p.Nutzername = fv.Produzent
    WHERE f.idFilme = ?
    GROUP BY
      f.idFilme,
      p.Anzeigename
  `;

  con.query(sql, [req.params.id], (err, result) => {
    if (err) {
      res.status(500).send('Error fetching movie');
      return;
    }

    res.json(result);
  });
});
app.get('/api/movies/likes/:id', (req, res) => {
  con.query('SELECT COUNT(*) AS anzahl_likes FROM Likes WHERE idFilm = ?' , [req.params.id], (err, result) => {
    if (err) {
      res.status(500).send('Error fetching like count');
    } else {
      res.json(result);
    }
  });
})

app.get('/api/movies/likes/:id/:nutzer', (req, res) => {
  con.query('SELECT COUNT(*) AS anzahl_likes FROM Likes WHERE idFilm = ? AND Nutzer = ?' , [req.params.id, req.params.nutzer], (err, result) => {
    if (err) {
      res.status(500).send('Error fetching like count');
    } else {
      res.json(result);
    }
  });
})

app.post('/api/movies/addLike/:idFilm/:nutzer', (req, res) => {
  const { idFilm, nutzer } = req.params;
  con.query('INSERT INTO Likes (idFilm, Nutzer) VALUES (?, ?)', [idFilm, nutzer], (err, result) => {
    if (err) {
      res.status(500).send('Error adding like');
    } else {
      res.json(result);
    }
  });
});

app.delete('/api/movies/removeLike/:idFilm/:nutzer', (req, res) => {
  const { idFilm, nutzer } = req.params;
  con.query('DELETE FROM Likes WHERE idFilm = ? AND Nutzer = ?', [idFilm, nutzer], (err, result) => {
    if (err) {
      res.status(500).send('Error removing like');
    } else {
      res.json(result);
    }
  });
});

app.get('/api/movies/aufrufe', (req, res) => {
  con.query('SELECT * FROM Filme ORDER BY Aufrufe DESC ', (err, result) => {
    if (err) {
      res.status(500).send('Error fetching movies');
    } else {
      res.json(result);
    }
  });
})

app.post('/api/movies/addAufruf/:idFilm', (req, res) => {
  console.log("POST angekommen");

  const { idFilm } = req.params;

  con.query(
    'UPDATE Filme SET Aufrufe = Aufrufe + 1 WHERE idFilme = ?',
    [idFilm],
    (err, result) => {
      console.log("UPDATE ausgeführt, affectedRows:");

      if (err) {
        console.log(err);
        res.status(500).send('Error');
        return;
      }

      res.json(result);
    }
  );
});



app.post("/api/movies/kommentar", (req, res) => {

  const { idFilm, Inhalt } = req.body;
  console.log(req.body);

  const sql = `
        INSERT INTO Kommentar (idFilm, Verfasser, Inhalt, Datum)
        VALUES (?, ?, ?, NOW())
    `;
  const nutzer = req.session.username;

  con.query(sql, [idFilm, nutzer, Inhalt], (err, result) => {

    if (err) {
      console.error(err);
      res.status(500).json({
        message: "Fehler beim Speichern"
      });
      return;
    }

    res.status(201).json({
      message: "Kommentar gespeichert"
    });

  });

});

app.get('/api/movies/kommentare/:id', (req, res) => {
  con.query('SELECT * FROM Kommentar WHERE idFilm = ? ORDER BY Datum DESC' , [req.params.id] , (err, result) => {
    if (err) {
      res.status(500).send('Error fetching comments');
    } else {
      res.json(result);
    }
  })
})

app.post('/api/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    res.status(400).json({
      message: 'Bitte Benutzername und Passwort eingeben'
    });
    return;
  }

  con.query(
    'SELECT * FROM Benutzer WHERE Nutzername = ?',
    [username],
    async (err, result: any) => {

      if (err) {
        console.error(err);
        res.status(500).json({
          message: 'Serverfehler beim Login'
        });
        return;
      }

      if (result.length === 0) {
        res.status(401).json({
          message: 'Benutzername oder Passwort falsch'
        });
        return;
      }

      const user = result[0];

      const passwordCorrect = await bcrypt.compare(
        password,
        user.Passwort
      );

      if (!passwordCorrect) {
        res.status(401).json({
          message: 'Benutzername oder Passwort falsch'
        });
        return;
      }

      req.session.username = user.Nutzername;

      con.query(
        'SELECT * FROM Produzenten WHERE Nutzername = ?',
        [user.Nutzername],
        (err, result:any)=>{

          res.json({

            message:'Login erfolgreich',
            username:user.Nutzername,
            istProduzent: result.length > 0

          });

        }
      );

    }
  );
});

app.get('/api/user',(req,res)=>{

  if(req.session.username){

    con.query(
      'SELECT * FROM Produzenten WHERE Nutzername = ?',
      [req.session.username],
      (err,result:any)=>{

        if(err){
          res.status(500).send();
          return;
        }


        res.json({
          username: req.session.username,
          istProduzent: result.length > 0
        });

      }
    );


  } else {

    res.status(401).send('Nicht eingeloggt');

  }

});

app.get('/api/produzent', (req, res) => {
  if (!req.session.username) {
    res.status(401).json({
      message: 'Nicht eingeloggt'
    });
    return;
  }
  con.query(
    `
    SELECT * FROM Produzenten WHERE Nutzername = ?`,
    [req.session.username],
    (err, result:any) => {

      if (err) {
        console.error(err);

        res.status(500).json({
          message:'Fehler beim Laden der Produzentendaten'
        });
        return;
      }
      if (result.length === 0) {

        res.json({
          istProduzent:false
        });

        return;
      }
      const produzent = result[0];
      res.json({
        istProduzent:true,
        anzeigename: produzent.Anzeigename,
        studiengang: produzent.Studiengang,
        email: produzent.Email
      });
    }
  );
});

app.post('/api/logout',(req,res)=>{

  req.session.destroy(()=>{

    res.json({
      message:'Logout erfolgreich'
    });

  });

});

app.post('/api/register', async (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  const rolle = req.body.rolle;
  const anzeigename = req.body.anzeigename;
  const studiengang = req.body.studiengang;
  const email = req.body.email;

  if (!username || !password) {
    res.status(400).json({
      message: 'Bitte Benutzername und Passwort angeben.'
    });
    return;
  }

  if (rolle === 'produzent') {
    if (!anzeigename || !studiengang || !email) {
      res.status(400).json({
        message: 'Bitte alle Produzentendaten ausfüllen.'
      });
      return;
    }
  }

  try {

    const hashedPassword = await bcrypt.hash(password, 10);

    con.beginTransaction((err) => {

      if (err) {
        console.error(err);
        res.status(500).json({
          message: 'Fehler beim Starten der Transaktion.'
        });
        return;
      }

      // Benutzer speichern
      con.query(
        'INSERT INTO Benutzer (Nutzername, Passwort) VALUES (?, ?)',
        [username, hashedPassword],
        (err) => {

          if (err) {
            return con.rollback(() => {
              console.error(err);
              res.status(500).json({
                message: 'Benutzername existiert bereits.'
              });
            });
          }

          // Normaler Nutzer
          if (rolle !== 'produzent') {

            return con.commit((err) => {

              if (err) {
                return con.rollback(() => {
                  console.error(err);
                  res.status(500).json({
                    message: 'Fehler beim Speichern.'
                  });
                });
              }
              res.json({
                message: 'Registrierung erfolgreich.'
              });
            });
          }

          // Produzent speichern
          con.query(
            `INSERT INTO Produzenten
            (Nutzername, Anzeigename, Studiengang, Email)
            VALUES (?, ?, ?, ?)`,
            [
              username,
              anzeigename,
              studiengang,
              email
            ],
            (err) => {

              if (err) {
                return con.rollback(() => {
                  console.error(err);
                  res.status(500).json({
                    message: 'Produzent konnte nicht gespeichert werden.'
                  });
                });
              }
              con.commit((err) => {

                if (err) {
                  return con.rollback(() => {
                    console.error(err);
                    res.status(500).json({
                      message: 'Fehler beim Abschließen der Registrierung.'
                    });
                  });
                }
                res.json({
                  message: 'Produzent erfolgreich registriert.'
                });
              });
            }
          );
        }
      );
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Fehler beim Hashen des Passworts.'
    });
  }
});

app.get('/api/movies/meine', (req, res) => {

  if (!req.session.username) {
    res.status(401).send('Nicht eingeloggt');
    return;
  }

  con.query(
    `
    SELECT f.*
    FROM Filme f
    JOIN Filmverwaltung fv
      ON fv.idFilm = f.idFilme
    WHERE fv.Produzent = ?
    ORDER BY f.UploadDatum DESC
    `,
    [req.session.username],
    (err, result) => {

      if (err) {
        res.status(500).send('Fehler');
        return;
      }

      res.json(result);

    }
  );

});


/*// Titel und Beschreibung aus dem Formular lesen, Film in Datenbank anlegen, neue FilmID erstellen = Cover(jpeg) und Film(mp4)*/
app.post('/api/movies',
  upload.fields([
    { name: 'cover', maxCount: 1 },
    { name: 'film', maxCount: 1 },
  ]),
  (req, res) => {
    const titel = req.body.titel;
    const beschreibung = req.body.beschreibung;

    if (!titel || !beschreibung) {
      res.status(400).send('Titel und Beschreibung müssen angegeben werden.');
      return;
    }

    con.query(
      'INSERT INTO Filme (Titel, Beschreibung, UploadDatum, Aufrufe) VALUES (?, ?, NOW(), 0)',
      [titel, beschreibung],
      (err, result: ResultSetHeader) => {
        if (err) {
          console.error(err);
          res.status(500).send('Fehler beim Anlegen des Films');
          return;
        }

        const filmId = result.insertId;

        const dateien = req.files as {
          cover?: Express.Multer.File[];
          film?: Express.Multer.File[];
        };

        const cover = dateien.cover?.[0];
        const film = dateien.film?.[0];

        if (cover) {
          renameSync(
            cover.path,
            join(titelbildOrdner, `${filmId}.jpg`)
          );
        }

        if (film) {
          renameSync(
            film.path,
            join(filmOrdner, `${filmId}.mp4`)
          );
        }
        con.query(
          'INSERT INTO Filmverwaltung (idFilm, Produzent) VALUES (?, ?)',
          [filmId, req.session.username],
          (err) => {
            if (err) {
              console.error(err);
            }
          }
        );
        const kategorien = JSON.parse(req.body.kategorien || '[]') as number[];

        if (kategorien.length > 0) {
          const platzhalter = kategorien.map(() => '(?, ?)').join(', ');
          const werte = kategorien.flatMap(idKategorie => [filmId, idKategorie]);

          con.query(
            `INSERT INTO Kategorieverwaltung (idFilm, idKategorie) VALUES ${platzhalter}`,
            werte,
            (err) => {
              if (err) {
                console.error(err);
                res.status(500).send('Fehler beim Speichern der Kategorien');
                return;
              }

              res.json({
                idFilme: filmId,
                message: 'Film wurde mit Kategorien gespeichert.',
              });
            }
          );

          return;
        }

        res.json({
          idFilme: filmId,
          message: 'Film wurde angelegt und Dateien wurden gespeichert.',
        });
      }
    );
  }
);

app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
