const express = require('express');
const validator = require('validator');
const router = express.Router();
const con = require('../../database');
const arr_indicadores = [
	{
		nome: "Usuarios", 
		caminho: "/usuarios"
	},
	{
		nome: "Produtos", 
		caminho: "/produtos"
	}
];

router.get('/', (req, res, next) => {
	res.status(200).json(arr_indicadores);
});

router.get('/produtos', (req, res, next) => {
	const categorias = con.query("SELECT COUNT(*) as QTDEPRODUTOS FROM produto", function (err, result, fields) {
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

module.exports = router;