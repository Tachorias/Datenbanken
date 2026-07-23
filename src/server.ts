import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import { createConnection, ResultSetHeader } from 'mysql2';
import { mkdirSync, renameSync } from 'node:fs';
import multer from 'multer';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();

/*// Liest JSON-Daten aus Requests*/
app.use(express.json());

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
    SELECT f.*
    FROM Filme f
    WHERE (
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

app.get('/api/movies/likes/:id', (req, res) => {
  con.query('SELECT COUNT(*) AS anzahl_likes FROM Likes WHERE idFilm = ?' , [req.params.id], (err, result) => {
    if (err) {
      res.status(500).send('Error fetching like count');
    } else {
      res.json(result);
    }
  });
})

app.get('/api/movies/aufrufe', (req, res) => {
  con.query('SELECT * FROM Filme ORDER BY Aufrufe DESC ', (err, result) => {
    if (err) {
      res.status(500).send('Error fetching movies');
    } else {
      res.json(result);
    }
  });
})

app.get('/api/movies/:id', (req, res) => {
  con.query('SELECT * FROM Filme WHERE idFilme = ? ' , [req.params.id] , (err, result) => {
    if (err) {
      res.status(500).send('Error fetching movie');
    } else {
      res.json(result);
    }
  })
})

app.get('/api/login/:username/:password', (req, res) => {
  con.query('SELECT * FROM Benutzer WHERE Benutzername = ? AND Passwort = ?', [req.params.username, req.params.password], (err, result) => {
    if (err) {
      res.status(500).send('Benutzername oder Passwort Falsch!');
    } else {
      res.json(result);
    }
  })
})


/*// Titel und Beschreibung aus dem Formular lesen, Film in Datenbank anlegen, neue FilmID erstellen = Cover(jpeg) und Film(mp4)*/
app.post(
  '/api/movies',
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
