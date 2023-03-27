-- use com muito cuidado!!! Apenas se precisar apagar e recriar o db
drop database
  if exists dindin;

-------------------------------
create database
  dindin;

create table
  usuarios (
    id serial primary key,
    nome varchar(255) not null,
    email varchar(50) not null unique,
    senha varchar(100)
  );

create table
  categorias (id serial primary key, descricao text);

create table
  transacoes (
    id serial primary key,
    descricao text,
    valor integer,
    data TIMESTAMP,
    usuario_id integer references usuarios(id),
    categoria_nome varchar(100),
    categoria_id integer references categorias(id),
    tipo varchar(20)
  );

insert into
  categorias (descricao)
values
('Alimentação'),
('Assinaturas e Serviços'),
('Casa'),
('Mercado'),
('Cuidados Pessoais'),
('Educação'),
('Família'),
('Lazer'),
('Pets'),
('Presentes'),
('Roupas'),
('Saúde'),
('Transporte'),
('Salário'),
('Vendas'),
('Outras receitas'),
('Outras despesas');
