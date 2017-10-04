<template>
	<header class="no-print">
		<p>{{ datosEmpresa.name }}</p>
		<ul>
			<li><router-link class="link" to="/">Inicio</router-link></li>
			<li><router-link class="link" to="/facturacion">Facturación</router-link></li>
			<li><router-link class="link" to="/facfinal">Fac.Final</router-link></li>
			<li><router-link class="link" to="/relacion">Relación</router-link></li>
			<li><router-link class="link" to="/productos">Productos</router-link></li>
			<li><router-link class="link" to="/datosempresa">Datos Empresa</router-link></li>
		</ul>
	</header>
</template>

<style lang="scss">
@media print {
	.no-print {
		display: none;
	}
}
header {
	width: 100%;
	height: 3rem;
	background-color: #004A7C;
	position: relative;
	top: 0;
	left: 0;
	color: white;
	& p {
		position: absolute;
		left: 1rem;
		font-size: 1.2rem;
		font-weight: bold;
		top: -0.1rem;
	}
	& ul {
		list-style: none;
		position: absolute;
		right: 1rem;
		& li {
			display: inline;
			margin: 0 0.5rem;
			& a {
				text-decoration: none;
				color: white;
			}
		}
	}
}
.link {
	font-size: 1.2rem;
	&:hover {
		color: #D2D6D6;
	}
}
/* eslint-disable eol-last */ 
</style>
