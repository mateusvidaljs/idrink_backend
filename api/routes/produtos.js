const express = require('express');
const validator = require('validator');
const router = express.Router();
const con = require('../../database');

router.get('/', (req, res, next) => {
	const produtos = con.query("SELECT * FROM produto", function (err, result, fields) {
		if (err) {
			res.status(200).json({
				erro: err
			});
		}
		else{
			res.status(200).json(result);
		}
	});
});

router.post('/', (req, res, next) => {
	const produto = {
		idcategoria: req.body.idcategoria,
		idfornecedor: req.body.idfornecedor,
		idpais: req.body.idpais,
		nome: req.body.nome,
		marca: req.body.marca,
		precocompra: parseFloat(req.body.precocompra),
		precovenda: parseFloat(req.body.precovenda),
		unidade: req.body.unidade,
		qtdeunidade: parseInt(req.body.qtdeunidade),
		teoralcoolico: req.body.teoralcoolico,
		qtdeminima: req.body.qtdeminima,
		unidadesemestoque: req.body.unidadesemestoque,
		unidadesemordem: req.body.unidadesemordem,
		nivelreposicao: req.body.nivelreposicao,
		promocao: req.body.promocao,
		status: req.body.status,
		foto: req.body.foto
	};

	const sql = con.query("INSERT INTO produto VALUES(NULL, " + produto.idcategoria + ", " + produto.idfornecedor + ", " + produto.idpais + ", '" + produto.nome + "', '" + produto.marca + "', " + produto.precocompra + ", " + produto.precovenda + ", '" + produto.unidade + "', " + produto.qtdeunidade + ", " + produto.teoralcoolico + ", " + produto.qtdeminima + ", " + produto.unidadesemestoque + ", " + produto.unidadesemordem + ", '" + produto.nivelreposicao + "', " + produto.promocao + ", '" + produto.status + "', '" + produto.foto + "', NOW())", function (err, result, fields) {
		if (err) {
			res.status(201).json({
				erro: err
			});
		}
		else{
			res.status(201).json(result);
		}
	});
});

router.get('/:produtoId', (req, res, next) => {
	const id = parseInt(validator.trim(validator.escape(req.params.produtoId)));
	const categorias = con.query("SELECT * FROM produto WHERE idproduto = " + id, function (err, result, fields) {
		if (err) {
			res.status(200).json({
				erro: err
			});
		}
		else{
			res.status(200).json(result);
		}
	});
});

router.get('/categoria/:categoriaNome', (req, res, next) => {
	const categoriaNome = validator.trim(validator.escape(req.params.categoriaNome));
	const categorias = con.query("SELECT P.idproduto, P.nomeproduto, P.marca, I.pais, I.icone, P.precovenda, P.unidade, P.qtdeunidade, P.teoralcoolico, P.unidadesemestoque, P.unidadesemordem, P.status, P.foto, C.idcategoriaproduto, C.subcategoria, C.categoria, F.nome AS 'nomefornecedor', F.idfornecedor FROM produto P JOIN categoria_produto C ON P.categoria_produto_idcategoriaproduto = C.idcategoriaproduto JOIN fornecedor F ON P.fornecedor_idfornecedor = F.idfornecedor JOIN produto_pais I ON P.produto_pais_idprodutopais = I.idprodutopais WHERE P.status = 'A' AND C.categoria = '" + categoriaNome + "'", function (err, result, fields) {
		if (err) {
			res.status(200).json({
				erro: err
			});
		}
		else{
			res.status(200).json(result);
		}
	});
});

router.get('/filtros/maisvendidos', (req, res, next) => {
	const categorias = con.query("SELECT P.idproduto, P.nomeproduto, P.marca, I.pais, I.icone, P.precovenda, P.unidade, P.qtdeunidade, P.teoralcoolico, P.unidadesemestoque, P.unidadesemordem, P.status, P.foto, C.idcategoriaproduto, C.subcategoria, C.categoria, F.nome AS 'nomefornecedor', F.idfornecedor FROM produto P JOIN categoria_produto C ON P.categoria_produto_idcategoriaproduto = C.idcategoriaproduto JOIN fornecedor F ON P.fornecedor_idfornecedor = F.idfornecedor JOIN produto_pais I ON P.produto_pais_idprodutopais = I.idprodutopais WHERE P.status = 'A' LIMIT 3", function (err, result, fields) {
		if (err) {
			res.status(200).json({
				erro: err
			});
		}
		else{
			res.status(200).json(result);
		}
	});
});

router.get('/likenome/:categoria/:produtoNome', (req, res, next) => {
	const produtoNome = validator.trim(validator.escape(req.params.produtoNome));
	const categoria = req.params.categoria;

	const categorias = con.query("SELECT P.idproduto, P.nomeproduto, P.marca, I.pais, I.icone, P.precovenda, P.unidade, P.qtdeunidade, P.teoralcoolico, P.unidadesemestoque, P.unidadesemordem, P.status, P.foto, C.idcategoriaproduto, C.subcategoria, C.categoria, F.nome AS 'nomefornecedor', F.idfornecedor FROM produto P JOIN categoria_produto C ON P.categoria_produto_idcategoriaproduto = C.idcategoriaproduto JOIN fornecedor F ON P.fornecedor_idfornecedor = F.idfornecedor JOIN produto_pais I ON P.produto_pais_idprodutopais = I.idprodutopais WHERE P.status = 'A' AND C.categoria = '" + categoria + "' AND P.nomeproduto LIKE '%" + produtoNome + "%'", function (err, result, fields) {
		if (err) {
			res.status(200).json({
				erro: err
			});
		}
		else{
			res.status(200).json(result);
		}
	});
});

router.get('/filtro/:categoria/:filtro', (req, res, next) => {
	const filtro = validator.trim(validator.escape(req.params.filtro));
	const categoria = validator.trim(validator.escape(req.params.categoria));
	var query = "SELECT P.idproduto, P.nomeproduto, P.marca, I.pais, I.icone, P.precovenda, P.unidade, P.qtdeunidade, P.teoralcoolico, P.unidadesemestoque, P.unidadesemordem, P.status, P.foto, C.idcategoriaproduto, C.subcategoria, C.categoria, F.nome AS 'nomefornecedor', F.idfornecedor FROM produto P JOIN categoria_produto C ON P.categoria_produto_idcategoriaproduto = C.idcategoriaproduto JOIN fornecedor F ON P.fornecedor_idfornecedor = F.idfornecedor JOIN produto_pais I ON P.produto_pais_idprodutopais = I.idprodutopais WHERE P.status = 'A' AND C.categoria = '" + categoria + "'";

	switch(filtro){
		case "precbaixo":
			query = "SELECT P.idproduto, P.nomeproduto, P.marca, I.pais, I.icone, P.precovenda, P.unidade, P.qtdeunidade, P.teoralcoolico, P.unidadesemestoque, P.unidadesemordem, P.status, P.foto, C.idcategoriaproduto, C.subcategoria, C.categoria, F.nome AS 'nomefornecedor', F.idfornecedor FROM produto P JOIN categoria_produto C ON P.categoria_produto_idcategoriaproduto = C.idcategoriaproduto JOIN fornecedor F ON P.fornecedor_idfornecedor = F.idfornecedor JOIN produto_pais I ON P.produto_pais_idprodutopais = I.idprodutopais WHERE P.status = 'A' AND C.categoria = '" + categoria + "' ORDER BY precovenda";
		break;
		case "precalto":
			query = "SELECT P.idproduto, P.nomeproduto, P.marca, I.pais, I.icone, P.precovenda, P.unidade, P.qtdeunidade, P.teoralcoolico, P.unidadesemestoque, P.unidadesemordem, P.status, P.foto, C.idcategoriaproduto, C.subcategoria, C.categoria, F.nome AS 'nomefornecedor', F.idfornecedor FROM produto P JOIN categoria_produto C ON P.categoria_produto_idcategoriaproduto = C.idcategoriaproduto JOIN fornecedor F ON P.fornecedor_idfornecedor = F.idfornecedor JOIN produto_pais I ON P.produto_pais_idprodutopais = I.idprodutopais WHERE P.status = 'A' AND C.categoria = '" + categoria + "' ORDER BY precovenda DESC";
		break;
		case "ordcre":
			query = "SELECT P.idproduto, P.nomeproduto, P.marca, I.pais, I.icone, P.precovenda, P.unidade, P.qtdeunidade, P.teoralcoolico, P.unidadesemestoque, P.unidadesemordem, P.status, P.foto, C.idcategoriaproduto, C.subcategoria, C.categoria, F.nome AS 'nomefornecedor', F.idfornecedor FROM produto P JOIN categoria_produto C ON P.categoria_produto_idcategoriaproduto = C.idcategoriaproduto JOIN fornecedor F ON P.fornecedor_idfornecedor = F.idfornecedor JOIN produto_pais I ON P.produto_pais_idprodutopais = I.idprodutopais WHERE P.status = 'A' AND C.categoria = '" + categoria + "' ORDER BY nomeproduto";
		break;
		case "orddec":
			query = "SELECT P.idproduto, P.nomeproduto, P.marca, I.pais, I.icone, P.precovenda, P.unidade, P.qtdeunidade, P.teoralcoolico, P.unidadesemestoque, P.unidadesemordem, P.status, P.foto, C.idcategoriaproduto, C.subcategoria, C.categoria, F.nome AS 'nomefornecedor', F.idfornecedor FROM produto P JOIN categoria_produto C ON P.categoria_produto_idcategoriaproduto = C.idcategoriaproduto JOIN fornecedor F ON P.fornecedor_idfornecedor = F.idfornecedor JOIN produto_pais I ON P.produto_pais_idprodutopais = I.idprodutopais WHERE P.status = 'A' AND C.categoria = '" + categoria + "' ORDER BY nomeproduto DESC";
		break;
		case "teoralc":
			query = "SELECT P.idproduto, P.nomeproduto, P.marca, I.pais, I.icone, P.precovenda, P.unidade, P.qtdeunidade, P.teoralcoolico, P.unidadesemestoque, P.unidadesemordem, P.status, P.foto, C.idcategoriaproduto, C.subcategoria, C.categoria, F.nome AS 'nomefornecedor', F.idfornecedor FROM produto P JOIN categoria_produto C ON P.categoria_produto_idcategoriaproduto = C.idcategoriaproduto JOIN fornecedor F ON P.fornecedor_idfornecedor = F.idfornecedor JOIN produto_pais I ON P.produto_pais_idprodutopais = I.idprodutopais WHERE P.status = 'A' AND C.categoria = '" + categoria + "' ORDER BY teoralcoolico";
		break;
		default:
			query = "SELECT P.idproduto, P.nomeproduto, P.marca, I.pais, I.icone, P.precovenda, P.unidade, P.qtdeunidade, P.teoralcoolico, P.unidadesemestoque, P.unidadesemordem, P.status, P.foto, C.idcategoriaproduto, C.subcategoria, C.categoria, F.nome AS 'nomefornecedor', F.idfornecedor FROM produto P JOIN categoria_produto C ON P.categoria_produto_idcategoriaproduto = C.idcategoriaproduto JOIN fornecedor F ON P.fornecedor_idfornecedor = F.idfornecedor JOIN produto_pais I ON P.produto_pais_idprodutopais = I.idprodutopais WHERE P.status = 'A' AND C.categoria = '" + categoria + "'";
	}

	const categorias = con.query(query, function (err, result, fields) {
		if (err) {
			res.status(200).json({
				erro: err
			});
		}
		else{
			res.status(200).json(result);
		}
	});
});

router.patch('/:categoriaId', (req, res, next) => {
	res.status(200).json({
		retorno: 'Produto Atualizado!'
	});
});

router.delete('/:produtoId', (req, res, next) => {
	var id = parseInt(validator.trim(validator.escape(req.params.produtoId)));
	const categorias = con.query("DELETE FROM produto WHERE idproduto = " + id, function (err, result, fields) {
		if (err) {
			res.status(200).json({
				erro: err
			});
		}
		else{
			res.status(200).json({
				retorno: 'Produto excluido com sucesso!',
				id: req.params.produtoId
			});
		}
	});
});

module.exports = router;