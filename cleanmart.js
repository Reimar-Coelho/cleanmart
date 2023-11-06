const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const port = 3000;

mongoose.connect("mongodb://127.0.0.1:27017/cleanmart", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const UsuarioSchema = new mongoose.Schema({
    email: { type: String, required: true },
    senha: { type: String, required: true }
});

const Usuario = mongoose.model("Usuario", UsuarioSchema);

const ProdutoLimpezaSchema = new mongoose.Schema({
    id_produtolimpeza: { type: String, required: true },
    descricao: { type: String},
    fornecedor: { type: String},
    dataFabricacao: { type: Date},
    quantidadeEstoque: { type: Number}
});

const ProdutoLimpeza = mongoose.model("ProdutoLimpeza", ProdutoLimpezaSchema);

app.post("/cadastrousuario", async (req, res) => {
    const email = req.body.email;
    const senha = req.body.senha;
  
    if(email == null || senha == null){
      return res.status(400).json({error : "Preencha todos os campos"});
    }
  
    const emailExiste = await Usuario.findOne({email : email});
  
    if(emailExiste){
      return res.status(400).json({error : "O email informado já existe"});
    }
  
    
    const usuario = new Usuario({
      email: email,
      senha: senha
    });
  
    try {
      const newUsuario = await usuario.save();
      res.json({ error: null, msg: "Cadastro ok", UsuarioId: newUsuario._id });
    } catch (error) {}
});

app.post("/cadastroprodutolimpeza", async (req, res) => {
    const id_produtolimpeza = req.body.id_produtolimpeza;
    const descricao = req.body.descricao;
    const fornecedor = req.body.fornecedor;
    const dataFabricacao = req.body.dataFabricacao;
    const quantidadeEstoque = req.body.quantidadeEstoque;
  
    if(id_produtolimpeza == null || descricao == null || fornecedor == null || dataFabricacao == null || quantidadeEstoque == null){
      return res.status(400).json({error : "Preencha todos os campos"});
    }
  
    const produtoExiste = await ProdutoLimpeza.findOne({id_produtolimpeza : id_produtolimpeza});
  
    if(produtoExiste){
      return res.status(400).json({error : "O produto informado já existe"});
    }
  
    
    const produtoLimpeza = new ProdutoLimpeza({
      id_produtolimpeza: id_produtolimpeza,
      descricao: descricao,
      fornecedor: fornecedor,
      dataFabricacao: dataFabricacao,
      quantidadeEstoque: quantidadeEstoque
    });
  
    try {
      const newProdutoLimpeza = await produtoLimpeza.save();
      res.json({ error: null, msg: "Cadastro ok", ProdutoId: newProduto._id });
    } catch (error) {}
});



app.get("/", async (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/cadastrousuario", async (req, res) => {
    res.sendFile(__dirname + "/cadastrousuario.html");
});

app.get("/cadastroprodutolimpeza", async (req, res) => {
    res.sendFile(__dirname + "/cadastroprodutolimpeza.html");
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
  