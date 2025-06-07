-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 30-03-2025 a las 13:02:22
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
  `area` varchar(100) DEFAULT NULL,
  `nombre` varchar(100) NOT NULL,
  `nombre_es` varchar(100) DEFAULT NULL,
  `keyword_google` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `busqueda` tinyint(1) DEFAULT 0,
  `fuente_id` int(11) DEFAULT 2
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `ll_rubros`
--

INSERT INTO `ll_rubros` (`id`, `area`, `nombre`, `nombre_es`, `keyword_google`, `created_at`, `busqueda`, `fuente_id`) VALUES
(1, NULL, 'Accounting', 'Contabilidad', 'accounting', '0000-00-00 00:00:00', 0, 2),
(2, NULL, 'Airport', 'Aeropuerto', 'airport', '0000-00-00 00:00:00', 0, 2),
(3, NULL, 'Amusement Park', 'Parque de atracciones', 'amusement_park', '0000-00-00 00:00:00', 0, 2),
(4, NULL, 'Aquarium', 'Acuario', 'aquarium', '0000-00-00 00:00:00', 0, 2),
(5, NULL, 'Art Gallery', 'Galeria de arte', 'art_gallery', '0000-00-00 00:00:00', 0, 2),
(6, NULL, 'Atm', 'Cajero automatico', 'atm', '0000-00-00 00:00:00', 0, 2),
(7, NULL, 'Bakery', 'Panaderia', 'bakery', '0000-00-00 00:00:00', 0, 2),
(8, NULL, 'Bank', 'Banco', 'bank', '0000-00-00 00:00:00', 0, 2),
(9, NULL, 'Bar', 'Bar', 'bar', '0000-00-00 00:00:00', 1, 2),
(10, NULL, 'Beauty Salon', 'Salon de belleza', 'beauty_salon', '0000-00-00 00:00:00', 0, 2),
(11, NULL, 'Bicycle Store', 'Bicicleteria', 'bicycle_store', '0000-00-00 00:00:00', 0, 2),
(12, NULL, 'Book Store', 'Libreria', 'book_store', '0000-00-00 00:00:00', 0, 2),
(13, NULL, 'Bowling Alley', 'Bolera', 'bowling_alley', '0000-00-00 00:00:00', 0, 2),
(14, NULL, 'Bus Station', 'Estacion de autobuses', 'bus_station', '0000-00-00 00:00:00', 0, 2),
(15, NULL, 'Cafe', 'Cafeteria', 'cafe', '0000-00-00 00:00:00', 0, 2),
(16, NULL, 'Campground', 'Campamento', 'campground', '0000-00-00 00:00:00', 0, 2),
(17, NULL, 'Car Dealer', 'Concesionario de coches', 'car_dealer', '0000-00-00 00:00:00', 0, 2),
(18, NULL, 'Car Rental', 'Alquiler de coches', 'car_rental', '0000-00-00 00:00:00', 0, 2),
(19, NULL, 'Car Repair', 'Taller mecanico', 'car_repair', '0000-00-00 00:00:00', 0, 2),
(20, NULL, 'Car Wash', 'Lavado de coches', 'car_wash', '0000-00-00 00:00:00', 0, 2),
(21, NULL, 'Casino', 'Casino', 'casino', '0000-00-00 00:00:00', 0, 2),
(22, NULL, 'Cemetery', 'Cementerio', 'cemetery', '0000-00-00 00:00:00', 0, 2),
(23, NULL, 'Church', 'Iglesia', 'church', '0000-00-00 00:00:00', 0, 2),
(24, NULL, 'City Hall', 'Ayuntamiento', 'city_hall', '0000-00-00 00:00:00', 0, 2),
(25, NULL, 'Clothing Store', 'Tienda de ropa', 'clothing_store', '0000-00-00 00:00:00', 0, 2),
(26, NULL, 'Convenience Store', 'Tienda de conveniencia', 'convenience_store', '0000-00-00 00:00:00', 0, 2),
(27, NULL, 'Courthouse', 'Juzgado', 'courthouse', '0000-00-00 00:00:00', 0, 2),
(28, NULL, 'Dentist', 'Dentista', 'dentist', '0000-00-00 00:00:00', 0, 2),
(29, NULL, 'Department Store', 'Grandes almacenes', 'department_store', '0000-00-00 00:00:00', 0, 2),
(30, NULL, 'Doctor', 'Medico', 'doctor', '0000-00-00 00:00:00', 0, 2),
(31, NULL, 'Drugstore', 'Farmacia', 'drugstore', '0000-00-00 00:00:00', 0, 2),
(32, NULL, 'Electrician', 'Electricista', 'electrician', '0000-00-00 00:00:00', 0, 2),
(33, NULL, 'Electronics Store', 'Tienda de electronica', 'electronics_store', '0000-00-00 00:00:00', 0, 2),
(34, NULL, 'Embassy', 'Embajada', 'embassy', '0000-00-00 00:00:00', 0, 2),
(35, NULL, 'Fire Station', 'Estacion de bomberos', 'fire_station', '0000-00-00 00:00:00', 0, 2),
(36, NULL, 'Florist', 'Floristeria', 'florist', '0000-00-00 00:00:00', 0, 2),
(37, NULL, 'Funeral Home', 'Funeraria', 'funeral_home', '0000-00-00 00:00:00', 0, 2),
(38, NULL, 'Furniture Store', 'Muebleria', 'furniture_store', '0000-00-00 00:00:00', 0, 2),
(39, NULL, 'Gas Station', 'Gasolinera', 'gas_station', '0000-00-00 00:00:00', 0, 2),
(40, NULL, 'Gym', 'Gimnasio', 'gym', '0000-00-00 00:00:00', 0, 2),
(41, NULL, 'Hair Care', 'Cuidado del cabello', 'hair_care', '0000-00-00 00:00:00', 0, 2),
(42, NULL, 'Hardware Store', 'Ferreteria', 'hardware_store', '0000-00-00 00:00:00', 0, 2),
(43, NULL, 'Hindu Temple', 'Templo hindu', 'hindu_temple', '0000-00-00 00:00:00', 0, 2),
(44, NULL, 'Home Goods Store', 'Articulos para el hogar', 'home_goods_store', '0000-00-00 00:00:00', 0, 2),
(45, NULL, 'Hospital', 'Hospital', 'hospital', '0000-00-00 00:00:00', 0, 2),
(46, NULL, 'Insurance Agency', 'Agencia de seguros', 'insurance_agency', '0000-00-00 00:00:00', 0, 2),
(47, NULL, 'Jewelry Store', 'Joyeria', 'jewelry_store', '0000-00-00 00:00:00', 0, 2),
(48, NULL, 'Laundry', 'Lavanderia', 'laundry', '0000-00-00 00:00:00', 0, 2),
(49, NULL, 'Lawyer', 'Abogado', 'lawyer', '0000-00-00 00:00:00', 0, 2),
(50, NULL, 'Library', 'Biblioteca', 'library', '0000-00-00 00:00:00', 0, 2),
(51, NULL, 'Light Rail Station', 'Estacion de tren ligero', 'light_rail_station', '0000-00-00 00:00:00', 0, 2),
(52, NULL, 'Liquor Store', 'Licoreria', 'liquor_store', '0000-00-00 00:00:00', 0, 2),
(53, NULL, 'Local Government Office', 'Oficina del gobierno local', 'local_government_office', '0000-00-00 00:00:00', 0, 2),
(54, NULL, 'Locksmith', 'Cerrajero', 'locksmith', '0000-00-00 00:00:00', 0, 2),
(55, NULL, 'Lodging', 'Alojamiento', 'lodging', '0000-00-00 00:00:00', 0, 2),
(56, NULL, 'Meal Delivery', 'Servicio de comidas a domicilio', 'meal_delivery', '0000-00-00 00:00:00', 0, 2),
(57, NULL, 'Meal Takeaway', 'Comidas Comida para llevar', 'meal_takeaway', '0000-00-00 00:00:00', 0, 2),
(58, NULL, 'Mosque', 'Mezquita', 'mosque', '0000-00-00 00:00:00', 0, 2),
(59, NULL, 'Movie Rental', 'Renta de peliculas', 'movie_rental', '0000-00-00 00:00:00', 0, 2),
(60, NULL, 'Movie Theater', 'Cine', 'movie_theater', '0000-00-00 00:00:00', 0, 2),
(61, NULL, 'Moving Company', 'Empresa de mudanzas', 'moving_company', '0000-00-00 00:00:00', 0, 2),
(62, NULL, 'Museum', 'Museo', 'museum', '0000-00-00 00:00:00', 0, 2),
(63, NULL, 'Night Club', 'Club nocturno', 'night_club', '0000-00-00 00:00:00', 0, 2),
(64, NULL, 'Painter', 'Pintor', 'painter', '0000-00-00 00:00:00', 0, 2),
(65, NULL, 'Park', 'Parque', 'park', '0000-00-00 00:00:00', 0, 2),
(66, NULL, 'Parking', 'Estacionamiento', 'parking', '0000-00-00 00:00:00', 0, 2),
(67, NULL, 'Pet Store', 'Tienda de mascotas', 'pet_store', '0000-00-00 00:00:00', 0, 2),
(68, NULL, 'Pharmacy', 'Farmacia', 'pharmacy', '0000-00-00 00:00:00', 0, 2),
(69, NULL, 'Physiotherapist', 'Fisioterapeuta', 'physiotherapist', '0000-00-00 00:00:00', 0, 2),
(70, NULL, 'Plumber', 'Fontanero', 'plumber', '0000-00-00 00:00:00', 0, 2),
(71, NULL, 'Police', 'Policia', 'police', '0000-00-00 00:00:00', 0, 2),
(72, NULL, 'Post Office', 'Correos', 'post_office', '0000-00-00 00:00:00', 0, 2),
(73, NULL, 'Primary School', 'Escuela primaria', 'primary_school', '0000-00-00 00:00:00', 0, 2),
(74, NULL, 'Real Estate Agency', 'Agencia inmobiliaria', 'real_estate_agency', '0000-00-00 00:00:00', 0, 2),
(75, NULL, 'Restaurant', 'Restaurante', 'restaurant', '0000-00-00 00:00:00', 0, 2),
(76, NULL, 'Roofing Contractor', 'Contratista de techos', 'roofing_contractor', '0000-00-00 00:00:00', 0, 2),
(77, NULL, 'Rv Park', 'Parque de caravanas', 'rv_park', '0000-00-00 00:00:00', 0, 2),
(78, NULL, 'School', 'Escuela', 'school', '0000-00-00 00:00:00', 0, 2),
(79, NULL, 'Secondary School', 'Escuela secundaria', 'secondary_school', '0000-00-00 00:00:00', 0, 2),
(80, NULL, 'Shoe Store', 'Zapateria', 'shoe_store', '0000-00-00 00:00:00', 0, 2),
(81, NULL, 'Shopping Mall', 'Centro comercial', 'shopping_mall', '0000-00-00 00:00:00', 0, 2),
(82, NULL, 'Spa', 'Spa', 'spa', '0000-00-00 00:00:00', 0, 2),
(83, NULL, 'Stadium', 'Estadio', 'stadium', '0000-00-00 00:00:00', 0, 2),
(84, NULL, 'Storage', 'Almacenamiento', 'storage', '0000-00-00 00:00:00', 0, 2),
(85, NULL, 'Store', 'Tienda', 'store', '0000-00-00 00:00:00', 0, 2),
(86, NULL, 'Subway Station', 'Estacion de metro', 'subway_station', '0000-00-00 00:00:00', 0, 2),
(87, NULL, 'Supermarket', 'Supermercado', 'supermarket', '0000-00-00 00:00:00', 0, 2),
(88, NULL, 'Synagogue', 'Sinagoga', 'synagogue', '0000-00-00 00:00:00', 0, 2),
(89, NULL, 'Taxi Stand', 'Parada de taxis', 'taxi_stand', '0000-00-00 00:00:00', 0, 2),
(90, NULL, 'Tourist Attraction', 'Atraccion turistica', 'tourist_attraction', '0000-00-00 00:00:00', 0, 2),
(91, NULL, 'Train Station', 'Estacion de tren', 'train_station', '0000-00-00 00:00:00', 0, 2),
(92, NULL, 'Transit Station', 'Estacion de transito', 'transit_station', '0000-00-00 00:00:00', 0, 2),
(93, NULL, 'Travel Agency', 'Agencia de viajes', 'travel_agency', '0000-00-00 00:00:00', 0, 2),
(94, NULL, 'University', 'Universidad', 'university', '0000-00-00 00:00:00', 0, 2),
(95, NULL, 'Veterinary Care', 'Atencion veterinaria', 'veterinary_care', '0000-00-00 00:00:00', 0, 2),
(96, NULL, 'Zoo', 'Zoologico', 'zoo', '0000-00-00 00:00:00', 0, 2);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `ll_rubros`
--
ALTER TABLE `ll_rubros`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_rubros_fuente` (`fuente_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `ll_rubros`
--
ALTER TABLE `ll_rubros`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=98;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `ll_rubros`
--
ALTER TABLE `ll_rubros`
  ADD CONSTRAINT `fk_rubros_fuente` FOREIGN KEY (`fuente_id`) REFERENCES `ll_fuentes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
