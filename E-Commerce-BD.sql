create database if not exists ECommerce;
use ECommerce;

create table users(
id_user int primary key auto_increment,
full_name varchar(100),
email varchar(100) unique,
pass_word varchar(100),
rolee enum("admin","client","seller"),
phone varchar(100),
adress text,
createdAT datetime
);

create table category(
id_category int primary key auto_increment,
category_name varchar(100),
category_description text,
image varchar(225)
);


create table SubCategory(
id_SubCategory int primary key auto_increment,
SubCategory_name varchar(100),
id_category int,
SubCategory_description text,
foreign key(id_category) references category(id_category)
);


create table product(
id_product int primary key auto_increment,
product_name varchar(100),
brand varchar(100),
product_description text,
price decimal(10,4),
stock int,
rating float,
id_seller int,
id_SubCategory int,
id_category int,
createdAtt datetime,
updatedAt datetime,
foreign key(id_SubCategory) references SubCategory(id_SubCategory),
foreign key(id_category) references category(id_category),
foreign key(id_seller) references users(id_user)
);

create table product_image(
id_product_image int primary key auto_increment,
imageURL varchar(225),
id_product int,
foreign key(id_product) references product(id_product)
);

create table review(
id_review int primary key auto_increment,
rating_review int,
commentt text,
id_product int,
id_client int,
review_createdAt datetime,
foreign key(id_product) references product(id_product),
foreign key(id_client) references users(id_user)
);

create table cart(
id_cart int primary key auto_increment,
id_client int,
cart_createdAt datetime,
foreign key(id_client) references users(id_user)
);

create table cart_item(
id_cart_item int primary key auto_increment,
id_cart int,
id_product int,
quantity int,
foreign key(id_cart) references cart(id_cart),
foreign key(id_product) references product(id_product) 
);

create table orders(
id_order int primary key auto_increment,
id_client int,
total_amount decimal(10,4),
payment_status enum("pending","paid","failed"),
order_status enum("processing","shipped","delivered","cancelled"),
order_createdAt datetime,
foreign key(id_client) references users(id_user) 
);

create table order_item(
id_order_item int primary key auto_increment,
id_order int,
id_product int,
order_item_quantity int,
order_item_price decimal(10,4),
foreign key(id_order) references orders(id_order),
foreign key(id_product) references product(id_product)
);

create table payment(
id_payment int primary key auto_increment,
id_order int,
payment_amount decimal(10,4),
method enum("card","cash_on_delivery","flouci"),
payment_status enum("succes","failed","pending"),
id_transaction int,
foreign key(id_order) references orders(id_order)
);

create table seller_profile(
id_seller_profile int primary key auto_increment,
id_user int,
shop_name varchar(100),
shop_description text,
verification_status enum("pending","verified","rejected"),
foreign key(id_user) references users(id_user)
);
