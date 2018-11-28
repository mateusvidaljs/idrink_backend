var app = require('./app_config.js');
var connection = require('./db_config.js');
var validator = require('validator');
var net = require('net');

var sess;

app.get('/', function(req, res){
	res.end('API iDrink está rodando, e pronta para uso!');
});

app.get('/islogged', function(req,res){
	sess = req.session;

	if(sess.login != '' && sess.login != null){
		res.json({
			resposta: true
		});
	}
	else{
		res.json({
			resposta: false
		});
	}
});

app.get('/destroyloginsession', function(req,res){
	req.session.destroy();
	res.end("Sessão finalizada com sucesso!");
});

app.post('/login', function(req, res){
	sess = req.session;
	var login = req.body['login'];
	var tipo_usuario = req.body['tipo_usuario'];
	var idusuario = req.body['idusuario'];

	sess.login = login;
	res.end(login);
});

app.post('/additemcarrinho', function(req, res){
	sess = req.session;

	var id = req.body['id'];
	var nome = req.body['nome'];
	var preco_unit = req.body['precounitario'];
	var quantidade = req.body['quantidade'];
	var preco_total = parseFloat(preco_unit) * parseFloat(quantidade);
	var itens = [];

	itens.push({
		id: id,
		nome: nome,
		preco_unit: preco_unit,
		quantidade: quantidade,
		preco_total: preco_total
	});

	sess.carrinho = itens;

	res.json(itens);
});

app.get('/getcarrinho', function(req, res){
	sess = req.session;
	res.json(sess.carrinho);
});

app.get('/categorias', function(req, res){
	connection.query("SELECT * FROM categoria_produto", function (err, result, fields) {
		if (err) {
			throw err
		}
		else{
			res.json(result);
		}
	});
});

app.get('/produtoporcategoria/:categoria', function(req, res){
	var categoria = validator.trim(validator.escape(req.params.categoria));

	connection.query("SELECT P.idproduto, P.nomeproduto, P.precovenda, P.unidade, P.qtdeunidade, P.teoralcoolico, P.unidadesemestoque, P.unidadesemordem, P.status, P.foto, C.subcategoria, C.categoria, F.nome AS 'nomefornecedor', F.idfornecedor FROM produto P JOIN categoria_produto C ON P.categoria_produto_idcategoriaproduto = C.idcategoriaproduto JOIN fornecedor F ON P.fornecedor_idfornecedor = F.idfornecedor WHERE P.status = 'A' AND C.categoria = '" + categoria + "'", function (err, result, fields) {
		if (err) {
			throw err
		}
		else{
			res.json(result);
		}
	});
});

app.get('/pesquisarproduto/:categoria/:filtro', function(req, res){
	var categoria = validator.trim(validator.escape(req.params.categoria));
	var filtro = validator.trim(validator.escape(req.params.filtro));

	connection.query("SELECT P.idproduto, P.nomeproduto, P.precovenda, P.unidade, P.qtdeunidade, P.teoralcoolico, P.unidadesemestoque, P.unidadesemordem, P.status, P.foto, C.subcategoria, C.categoria, F.nome AS 'nomefornecedor', F.idfornecedor FROM produto P JOIN categoria_produto C ON P.categoria_produto_idcategoriaproduto = C.idcategoriaproduto JOIN fornecedor F ON P.fornecedor_idfornecedor = F.idfornecedor WHERE P.status = 'A' AND C.categoria = '" + categoria + "' AND P.nomeproduto LIKE '%" + filtro + "%'", function (err, result, fields) {
		if (err) {
			throw err
		}
		else{
			res.json(result);
		}
	});
});

app.get('/produtospromocao', function(req, res){
	connection.query("SELECT P.idproduto, P.nomeproduto, P.precovenda, P.unidade, P.qtdeunidade, P.teoralcoolico, P.unidadesemestoque, P.unidadesemordem, P.status, P.promocao, P.foto, C.subcategoria, C.categoria, F.nome AS 'nomefornecedor', F.idfornecedor FROM produto P JOIN categoria_produto C ON P.categoria_produto_idcategoriaproduto = C.idcategoriaproduto JOIN fornecedor F ON P.fornecedor_idfornecedor = F.idfornecedor WHERE P.status = 'A' AND P.promocao = true LIMIT 3", function (err, result, fields) {
		if (err) {
			throw err
		}
		else{
			res.json(result);
		}
	});
});

app.get('/produtofiltrado/:categoria/:filtro', function(req, res){
	var filtro = validator.trim(validator.escape(req.params.filtro));
	var categoria = validator.trim(validator.escape(req.params.categoria));
	var query = "SELECT P.idproduto, P.nomeproduto, P.precovenda, P.unidade, P.qtdeunidade, P.teoralcoolico, P.unidadesemestoque, P.unidadesemordem, P.status, P.foto, C.subcategoria, C.categoria, F.nome AS 'nomefornecedor', F.idfornecedor FROM produto P JOIN categoria_produto C ON P.categoria_produto_idcategoriaproduto = C.idcategoriaproduto JOIN fornecedor F ON P.fornecedor_idfornecedor = F.idfornecedor WHERE P.status = 'A' AND C.categoria = '" + categoria + "'";

	switch(filtro){
		case "precbaixo":
			query = "SELECT P.idproduto, P.nomeproduto, P.precovenda, P.unidade, P.qtdeunidade, P.teoralcoolico, P.unidadesemestoque, P.unidadesemordem, P.status, P.foto, C.subcategoria, C.categoria, F.nome AS 'nomefornecedor', F.idfornecedor FROM produto P JOIN categoria_produto C ON P.categoria_produto_idcategoriaproduto = C.idcategoriaproduto JOIN fornecedor F ON P.fornecedor_idfornecedor = F.idfornecedor WHERE P.status = 'A' AND C.categoria = '" + categoria + "' ORDER BY precovenda";
		break;
		case "precalto":
			query = "SELECT P.idproduto, P.nomeproduto, P.precovenda, P.unidade, P.qtdeunidade, P.teoralcoolico, P.unidadesemestoque, P.unidadesemordem, P.status, P.foto, C.subcategoria, C.categoria, F.nome AS 'nomefornecedor', F.idfornecedor FROM produto P JOIN categoria_produto C ON P.categoria_produto_idcategoriaproduto = C.idcategoriaproduto JOIN fornecedor F ON P.fornecedor_idfornecedor = F.idfornecedor WHERE P.status = 'A' AND C.categoria = '" + categoria + "' ORDER BY precovenda DESC";
		break;
		case "ordcre":
			query = "SELECT P.idproduto, P.nomeproduto, P.precovenda, P.unidade, P.qtdeunidade, P.teoralcoolico, P.unidadesemestoque, P.unidadesemordem, P.status, P.foto, C.subcategoria, C.categoria, F.nome AS 'nomefornecedor', F.idfornecedor FROM produto P JOIN categoria_produto C ON P.categoria_produto_idcategoriaproduto = C.idcategoriaproduto JOIN fornecedor F ON P.fornecedor_idfornecedor = F.idfornecedor WHERE P.status = 'A' AND C.categoria = '" + categoria + "' ORDER BY nomeproduto";
		break;
		case "orddec":
			query = "SELECT P.idproduto, P.nomeproduto, P.precovenda, P.unidade, P.qtdeunidade, P.teoralcoolico, P.unidadesemestoque, P.unidadesemordem, P.status, P.foto, C.subcategoria, C.categoria, F.nome AS 'nomefornecedor', F.idfornecedor FROM produto P JOIN categoria_produto C ON P.categoria_produto_idcategoriaproduto = C.idcategoriaproduto JOIN fornecedor F ON P.fornecedor_idfornecedor = F.idfornecedor WHERE P.status = 'A' AND C.categoria = '" + categoria + "' ORDER BY nomeproduto DESC";
		break;
		case "teoralc":
			query = "SELECT P.idproduto, P.nomeproduto, P.precovenda, P.unidade, P.qtdeunidade, P.teoralcoolico, P.unidadesemestoque, P.unidadesemordem, P.status, P.foto, C.subcategoria, C.categoria, F.nome AS 'nomefornecedor', F.idfornecedor FROM produto P JOIN categoria_produto C ON P.categoria_produto_idcategoriaproduto = C.idcategoriaproduto JOIN fornecedor F ON P.fornecedor_idfornecedor = F.idfornecedor WHERE P.status = 'A' AND C.categoria = '" + categoria + "' ORDER BY teoralcoolico";
		break;
		default:
			query = "SELECT P.idproduto, P.nomeproduto, P.precovenda, P.unidade, P.qtdeunidade, P.teoralcoolico, P.unidadesemestoque, P.unidadesemordem, P.status, P.foto, C.subcategoria, C.categoria, F.nome AS 'nomefornecedor', F.idfornecedor FROM produto P JOIN categoria_produto C ON P.categoria_produto_idcategoriaproduto = C.idcategoriaproduto JOIN fornecedor F ON P.fornecedor_idfornecedor = F.idfornecedor WHERE P.status = 'A' AND C.categoria = '" + categoria + "'";
	}

	connection.query(query, function (err, result, fields) {
		if (err) {
			throw err
		}
		else{
			res.json(result);
		}
	});
});

app.get('/produto/:idprod', function(req, res){
	var idprod = validator.trim(validator.escape(req.params.idprod));

	connection.query("SELECT * FROM produto WHERE idproduto = " + idprod, function (err, result, fields) {
		if (err) {
			throw err
		}
		else{
			res.json(result);
		}
	});
});