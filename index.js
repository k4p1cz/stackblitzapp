import express from 'express';
import axios from 'axios';

const app = express();

app.use(express.urlencoded());

var searchData = null;

app.get('/', (req, res) => {
  res.write(
    `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
        </head>
        <body>
          <main>
            <h1>VYHLEDÁVAČ AUTORŮ A KNIH</h1>
            <h2>Vyberte, co chcete vyhledat</h2>

            <div class="container">
              <button onclick="redirect('autor')">AUTOR</button>
            </div>
            

          </main>
        </body>

        <style>
          h1{
            text-align: center;
            font-family: Arial, sans-serif;
            font-size: 2rem;
          }
          h2{
            text-align: center;
            font-family: Arial, sans-serif;
            font-size: 1.75rem;
            margin-top: 2rem;
          }
          .container{
            text-align: center;
          }
          .container button{
            font-family: Arial, sans-serif;
            font-size: 1.25rem;
            background-color: transparent;
            color: #000;
            transition: all 200ms ease;
            border: 2px solid #000;
            padding: 1rem 2rem;
            margin: 2rem 1rem;
            border-radius: .5rem;
            cursor: pointer;
          }
          .container button:hover{
            background-color: #000;
            color: #fff;
          }
        </style>

        <script>
          function redirect(e){
            switch(e){
              case 'kniha':
                location.href = "./kniha";
              break;
              case 'autor':
                location.href = "./autor";
              break;
            }


          }
        </script>
      </html>
    
    `
  );
  res.end();
});

app.get('/autor', (req, res) => {
  res.write(
    `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
        </head>
        <body>
          <main>
            <form action="./autor/vysledek" method="POST">
              <input type="text" placeholder="Jmeno autora" name="autor" required>
              <br>
              <button type="submit">HLEDAT</button>
            </form>
          </main>
        </body>

        <style>
          main form{
            text-align: center;
          }
          main form input{
            font-family: Arial, sans-serif;
            font-size: 1.25rem;
            color: #000;
            background-color: transparent;
            padding: .5rem 1rem;
            border: 2px solid #000;
            border-radius: 1rem;
          }
          main form button{
            font-family: Arial, sans-serif;
            font-size: 1.5rem;
            background-color: transparent;
            color: #000;
            transition: all 200ms ease;
            border: 2px solid #000;
            padding: 1rem 2rem;
            margin: 2rem 1rem;
            border-radius: .5rem;
            cursor: pointer;
          }
          main form button:hover{
            color: #fff;
            background-color: #000;
          }
          
        </style>
      </html>
    `
  );
  res.end();
});

app.post('/autor/vysledek', async (req, res) => {
  const autor = req.body.autor;
  const url = 'https://openlibrary.org/search/authors.json?q=';

  var api_url = url + autor;

  const ruian = await axios.get(api_url);

  let data = ruian.data;

  if (data.numFound == 0) {
    data = null;
  }

  res.redirect(
    `/autor/vysledek?data=${encodeURIComponent(JSON.stringify(data))}`
  );
});

app.get('/autor/vysledek', (req, res) => {
  const data = JSON.parse(req.query.data);

  if (req.query.data == undefined) {
  } else {
    var html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
        </head>
        <body>
    `;

    var html_ = `
      <style>
        .container{
          text-align: center;
          border-bottom: 2px solid #000;
        }
        .container .author_name{
          font-family: Arial, sans-serif;
          font-size: 1.25rem;
          font-weight: strong;
        }
        .container .top_dilo{
          font-family: Arial, sans-serif;
          font-size: 1.125rem;
          margin-top: -1rem;
        }
        .container .dalsi_dila{
          font-family: Arial, sans-serif;
          font-size: 1rem;
          margin-top: -1rem;
        } 
      </style>
      </body>
      </html>
      `;

    for (let i = 0; i < data.numFound; i++) {
      if (data.docs[i] != undefined) {
        html += `
          <div class='container'>
            <p class='author_name'><strong>${data.docs[i].name}</strong> (${data.docs[i].birth_date} - ${data.docs[i].death_date})</p>
            <p class='top_dilo'>Nejznáměnší dílo: ${data.docs[i].top_work}</p>
            <p class='dalsi_dila'>A dalších ${data.docs[i].work_count} děl...</p>
          </div>
          <span class='line'></span>
        `;
      }
    }
    html += html_;
    res.write(`${html}`);
  }
});

app.listen('5500');
