import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import session from 'express-session';
import { join } from 'node:path';
import {createConnection} from 'mysql2';

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

const angularApp = new AngularNodeAppEngine();
var con = createConnection({
  host: "192.168.110.94",
  user: "26_DB_Grp5",
  password: "0CqWrDxDlDXsJugpu4rf",
  database: "26_DB_Gruppe5",
  ssl:{rejectUnauthorized: false}
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

app.post('/api/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  con.query(
    'SELECT * FROM Benutzer WHERE Nutzername = ? AND Passwort = ?',
    [username, password],
    (err, result:any)=>{

      if(err){
        res.status(500).send('Fehler beim Login');
        console.log(err);

      } else {
        if(result.length > 0){
          const user = result[0];
          req.session.username = user['Nutzername'];
          req.session.password = user['Passwort'];
          res.json(result[0]);
          console.log(result[0]);

        } else {
          res.status(401).send('Falsche Daten');

        }
      }
    }
  );
});

app.get('/api/user',(req,res)=>{

  if(req.session.username){

    res.json({
      Nutzername: req.session.username
    });

  }else{

    res.status(401).send('Nicht eingeloggt');

  }

});

app.post('/api/logout',(req,res)=>{

  req.session.destroy(()=>{

    res.json({
      message:'Logout erfolgreich'
    });

  });

});

app.post('/api/register', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  con.query(
    'INSERT INTO Benutzer (Nutzername, Passwort) VALUES (?, ?)',
    [username, password],
    (err, result) => {

      if (err) {
        res.status(500).send('Fehler beim Speichern des Benutzers');

      } else {
        res.json({
          message: 'Registrierung erfolgreich'
        });

      }
    }
  );
})



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
