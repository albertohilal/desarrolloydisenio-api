-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 24-03-2025 a las 15:55:50
-- Versión del servidor: 10.11.11-MariaDB-cll-lve
-- Versión de PHP: 8.3.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `iunaorg_doli184`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ll_rubros`
--

CREATE TABLE `ll_rubros` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `nombre_es` varchar(100) DEFAULT NULL,
  `keyword_google` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `busqueda` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `ll_rubros`
--

INSERT INTO `ll_rubros` (`id`, `nombre`, `nombre_es`, `keyword_google`, `created_at`, `busqueda`) VALUES
(1, 'Accounting', 'Contabilidad', 'accounting', '0000-00-00 00:00:00', 0),
(2, 'Airport', 'Aeropuerto', 'airport', '0000-00-00 00:00:00', 0),
(3, 'Amusement Park', 'Parque de atracciones', 'amusement_park', '0000-00-00 00:00:00', 0),
(4, 'Aquarium', 'Acuario', 'aquarium', '0000-00-00 00:00:00', 0),
(5, 'Art Gallery', 'Galeria de arte', 'art_gallery', '0000-00-00 00:00:00', 0),
(6, 'Atm', 'Cajero automatico', 'atm', '0000-00-00 00:00:00', 0),
(7, 'Bakery', 'Panaderia', 'bakery', '0000-00-00 00:00:00', 0),
(8, 'Bank', 'Banco', 'bank', '0000-00-00 00:00:00', 0),
(9, 'Bar', 'Bar', 'bar', '0000-00-00 00:00:00', 0),
(10, 'Beauty Salon', 'Salon de belleza', 'beauty_salon', '0000-00-00 00:00:00', 0),
(11, 'Bicycle Store', 'Bicicleteria', 'bicycle_store', '0000-00-00 00:00:00', 0),
(12, 'Book Store', 'Libreria', 'book_store', '0000-00-00 00:00:00', 0),
(13, 'Bowling Alley', 'Bolera', 'bowling_alley', '0000-00-00 00:00:00', 0),
(14, 'Bus Station', 'Estacion de autobuses', 'bus_station', '0000-00-00 00:00:00', 0),
(15, 'Cafe', 'Cafeteria', 'cafe', '0000-00-00 00:00:00', 0),
(16, 'Campground', 'Campamento', 'campground', '0000-00-00 00:00:00', 0),
(17, 'Car Dealer', 'Concesionario de coches', 'car_dealer', '0000-00-00 00:00:00', 0),
(18, 'Car Rental', 'Alquiler de coches', 'car_rental', '0000-00-00 00:00:00', 0),
(19, 'Car Repair', 'Taller mecanico', 'car_repair', '0000-00-00 00:00:00', 0),
(20, 'Car Wash', 'Lavado de coches', 'car_wash', '0000-00-00 00:00:00', 0),
(21, 'Casino', 'Casino', 'casino', '0000-00-00 00:00:00', 0),
(22, 'Cemetery', 'Cementerio', 'cemetery', '0000-00-00 00:00:00', 0),
(23, 'Church', 'Iglesia', 'church', '0000-00-00 00:00:00', 0),
(24, 'City Hall', 'Ayuntamiento', 'city_hall', '0000-00-00 00:00:00', 0),
(25, 'Clothing Store', 'Tienda de ropa', 'clothing_store', '0000-00-00 00:00:00', 0),
(26, 'Convenience Store', 'Tienda de conveniencia', 'convenience_store', '0000-00-00 00:00:00', 0),
(27, 'Courthouse', 'Juzgado', 'courthouse', '0000-00-00 00:00:00', 0),
(28, 'Dentist', 'Dentista', 'dentist', '0000-00-00 00:00:00', 0),
(29, 'Department Store', 'Grandes almacenes', 'department_store', '0000-00-00 00:00:00', 0),
(30, 'Doctor', 'Medico', 'doctor', '0000-00-00 00:00:00', 0),
(31, 'Drugstore', 'Farmacia', 'drugstore', '0000-00-00 00:00:00', 0),
(32, 'Electrician', 'Electricista', 'electrician', '0000-00-00 00:00:00', 0),
(33, 'Electronics Store', 'Tienda de electronica', 'electronics_store', '0000-00-00 00:00:00', 0),
(34, 'Embassy', 'Embajada', 'embassy', '0000-00-00 00:00:00', 0),
(35, 'Fire Station', 'Estacion de bomberos', 'fire_station', '0000-00-00 00:00:00', 0),
(36, 'Florist', 'Floristeria', 'florist', '0000-00-00 00:00:00', 0),
(37, 'Funeral Home', 'Funeraria', 'funeral_home', '0000-00-00 00:00:00', 0),
(38, 'Furniture Store', 'Muebleria', 'furniture_store', '0000-00-00 00:00:00', 0),
(39, 'Gas Station', 'Gasolinera', 'gas_station', '0000-00-00 00:00:00', 0),
(40, 'Gym', 'Gimnasio', 'gym', '0000-00-00 00:00:00', 0),
(41, 'Hair Care', 'Cuidado del cabello', 'hair_care', '0000-00-00 00:00:00', 0),
(42, 'Hardware Store', 'Ferreteria', 'hardware_store', '0000-00-00 00:00:00', 0),
(43, 'Hindu Temple', 'Templo hindu', 'hindu_temple', '0000-00-00 00:00:00', 0),
(44, 'Home Goods Store', 'Articulos para el hogar', 'home_goods_store', '0000-00-00 00:00:00', 0),
(45, 'Hospital', 'Hospital', 'hospital', '0000-00-00 00:00:00', 0),
(46, 'Insurance Agency', 'Agencia de seguros', 'insurance_agency', '0000-00-00 00:00:00', 0),
(47, 'Jewelry Store', 'Joyeria', 'jewelry_store', '0000-00-00 00:00:00', 0),
(48, 'Laundry', 'Lavanderia', 'laundry', '0000-00-00 00:00:00', 0),
(49, 'Lawyer', 'Abogado', 'lawyer', '0000-00-00 00:00:00', 0),
(50, 'Library', 'Biblioteca', 'library', '0000-00-00 00:00:00', 0),
(51, 'Light Rail Station', 'Estacion de tren ligero', 'light_rail_station', '0000-00-00 00:00:00', 0),
(52, 'Liquor Store', 'Licoreria', 'liquor_store', '0000-00-00 00:00:00', 0),
(53, 'Local Government Office', 'Oficina del gobierno local', 'local_government_office', '0000-00-00 00:00:00', 0),
(54, 'Locksmith', 'Cerrajero', 'locksmith', '0000-00-00 00:00:00', 0),
(55, 'Lodging', 'Alojamiento', 'lodging', '0000-00-00 00:00:00', 0),
(56, 'Meal Delivery', 'Servicio de comidas a domicilio', 'meal_delivery', '0000-00-00 00:00:00', 0),
(57, 'Meal Takeaway', 'Comidas Comida para llevar', 'meal_takeaway', '0000-00-00 00:00:00', 0),
(58, 'Mosque', 'Mezquita', 'mosque', '0000-00-00 00:00:00', 0),
(59, 'Movie Rental', 'Renta de peliculas', 'movie_rental', '0000-00-00 00:00:00', 0),
(60, 'Movie Theater', 'Cine', 'movie_theater', '0000-00-00 00:00:00', 0),
(61, 'Moving Company', 'Empresa de mudanzas', 'moving_company', '0000-00-00 00:00:00', 0),
(62, 'Museum', 'Museo', 'museum', '0000-00-00 00:00:00', 0),
(63, 'Night Club', 'Club nocturno', 'night_club', '0000-00-00 00:00:00', 0),
(64, 'Painter', 'Pintor', 'painter', '0000-00-00 00:00:00', 0),
(65, 'Park', 'Parque', 'park', '0000-00-00 00:00:00', 0),
(66, 'Parking', 'Estacionamiento', 'parking', '0000-00-00 00:00:00', 0),
(67, 'Pet Store', 'Tienda de mascotas', 'pet_store', '0000-00-00 00:00:00', 0),
(68, 'Pharmacy', 'Farmacia', 'pharmacy', '0000-00-00 00:00:00', 0),
(69, 'Physiotherapist', 'Fisioterapeuta', 'physiotherapist', '0000-00-00 00:00:00', 0),
(70, 'Plumber', 'Fontanero', 'plumber', '0000-00-00 00:00:00', 0),
(71, 'Police', 'Policia', 'police', '0000-00-00 00:00:00', 0),
(72, 'Post Office', 'Correos', 'post_office', '0000-00-00 00:00:00', 0),
(73, 'Primary School', 'Escuela primaria', 'primary_school', '0000-00-00 00:00:00', 0),
(74, 'Real Estate Agency', 'Agencia inmobiliaria', 'real_estate_agency', '0000-00-00 00:00:00', 0),
(75, 'Restaurant', 'Restaurante', 'restaurant', '0000-00-00 00:00:00', 0),
(76, 'Roofing Contractor', 'Contratista de techos', 'roofing_contractor', '0000-00-00 00:00:00', 0),
(77, 'Rv Park', 'Parque de caravanas', 'rv_park', '0000-00-00 00:00:00', 0),
(78, 'School', 'Escuela', 'school', '0000-00-00 00:00:00', 0),
(79, 'Secondary School', 'Escuela secundaria', 'secondary_school', '0000-00-00 00:00:00', 0),
(80, 'Shoe Store', 'Zapateria', 'shoe_store', '0000-00-00 00:00:00', 0),
(81, 'Shopping Mall', 'Centro comercial', 'shopping_mall', '0000-00-00 00:00:00', 0),
(82, 'Spa', 'Spa', 'spa', '0000-00-00 00:00:00', 0),
(83, 'Stadium', 'Estadio', 'stadium', '0000-00-00 00:00:00', 0),
(84, 'Storage', 'Almacenamiento', 'storage', '0000-00-00 00:00:00', 0),
(85, 'Store', 'Tienda', 'store', '0000-00-00 00:00:00', 0),
(86, 'Subway Station', 'Estacion de metro', 'subway_station', '0000-00-00 00:00:00', 0),
(87, 'Supermarket', 'Supermercado', 'supermarket', '0000-00-00 00:00:00', 0),
(88, 'Synagogue', 'Sinagoga', 'synagogue', '0000-00-00 00:00:00', 0),
(89, 'Taxi Stand', 'Parada de taxis', 'taxi_stand', '0000-00-00 00:00:00', 0),
(90, 'Tourist Attraction', 'Atraccion turistica', 'tourist_attraction', '0000-00-00 00:00:00', 0),
(91, 'Train Station', 'Estacion de tren', 'train_station', '0000-00-00 00:00:00', 0),
(92, 'Transit Station', 'Estacion de transito', 'transit_station', '0000-00-00 00:00:00', 0),
(93, 'Travel Agency', 'Agencia de viajes', 'travel_agency', '0000-00-00 00:00:00', 0),
(94, 'University', 'Universidad', 'university', '0000-00-00 00:00:00', 0),
(95, 'Veterinary Care', 'Atencion veterinaria', 'veterinary_care', '0000-00-00 00:00:00', 0),
(96, 'Zoo', 'Zoologico', 'zoo', '0000-00-00 00:00:00', 0);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `ll_rubros`
--
ALTER TABLE `ll_rubros`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `ll_rubros`
--
ALTER TABLE `ll_rubros`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=98;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
