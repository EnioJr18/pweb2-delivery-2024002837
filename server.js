import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import expressEjsLayouts from 'express-ejs-layouts';
import session from 'express-session';
import flash from 'connect-flash';
import methodOverride from 'method-override';
import { criarRotas } from './src/routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


app.use(express.urlencoded({ extended: true })); 
app.use(express.json());

app.use(methodOverride('_method'));

app.use(session({
  secret: 'segredo_do_delivery_tracker',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));
app.use(expressEjsLayouts);
app.set('layout', 'layouts/base');

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.oldData = req.flash('oldData')[0] || {};
  next();
});

app.use(criarRotas());

app.get('/api/health', (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor SSR rodando em http://localhost:${PORT}`);
});