-- Migration for WhatsApp Campaign Tables
-- Date: 2024-12-XX
-- Purpose: Add WhatsApp campaign functionality to the system

-- ========================================
-- 1. Create ll_fuentes table (required for ll_rubros foreign key)
-- ========================================

CREATE TABLE IF NOT EXISTS `ll_fuentes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Insert default source
INSERT IGNORE INTO `ll_fuentes` (`id`, `nombre`, `descripcion`) VALUES 
(2, 'Google Places', 'Fuente de datos de Google Places API');

-- ========================================
-- 2. Create ll_campanias_whatsapp table
-- ========================================

CREATE TABLE IF NOT EXISTS `ll_campanias_whatsapp` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `mensaje` text NOT NULL,
  `fecha_creacion` datetime DEFAULT current_timestamp(),
  `estado` enum('pendiente','en_progreso','finalizado') DEFAULT 'pendiente',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- ========================================
-- 3. Create ll_envios_whatsapp table
-- ========================================

CREATE TABLE IF NOT EXISTS `ll_envios_whatsapp` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `campania_id` int(11) NOT NULL,
  `telefono_wapp` varchar(255) DEFAULT NULL,
  `nombre_destino` varchar(255) DEFAULT NULL,
  `mensaje_final` text DEFAULT NULL,
  `estado` enum('pendiente','enviado','error') DEFAULT 'pendiente',
  `fecha_envio` datetime DEFAULT NULL,
  `lugar_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_unico_envio` (`campania_id`,`telefono_wapp`),
  CONSTRAINT `ll_envios_whatsapp_ibfk_1` FOREIGN KEY (`campania_id`) REFERENCES `ll_campanias_whatsapp` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- ========================================
-- 4. Add missing fields to ll_lugares table
-- ========================================

-- Add the rubro field (this might already exist)
ALTER TABLE `ll_lugares` 
ADD COLUMN IF NOT EXISTS `rubro` varchar(100) DEFAULT NULL AFTER `nombre`;

-- Add rating field
ALTER TABLE `ll_lugares` 
ADD COLUMN IF NOT EXISTS `rating` decimal(2,1) DEFAULT NULL AFTER `created_at`;

-- Add reviews field  
ALTER TABLE `ll_lugares` 
ADD COLUMN IF NOT EXISTS `reviews` int(11) DEFAULT 0 AFTER `rating`;

-- Add tipos field
ALTER TABLE `ll_lugares` 
ADD COLUMN IF NOT EXISTS `tipos` text DEFAULT NULL AFTER `reviews`;

-- Add precio field
ALTER TABLE `ll_lugares` 
ADD COLUMN IF NOT EXISTS `precio` tinyint(4) DEFAULT NULL AFTER `tipos`;

-- Add abierto field
ALTER TABLE `ll_lugares` 
ADD COLUMN IF NOT EXISTS `abierto` tinyint(1) DEFAULT NULL AFTER `precio`;

-- Add telefono_wapp field
ALTER TABLE `ll_lugares` 
ADD COLUMN IF NOT EXISTS `telefono_wapp` varchar(20) DEFAULT NULL AFTER `abierto`;

-- Add wapp_valido field
ALTER TABLE `ll_lugares` 
ADD COLUMN IF NOT EXISTS `wapp_valido` tinyint(1) DEFAULT NULL AFTER `telefono_wapp`;

-- ========================================
-- 5. Add missing fields to ll_rubros table
-- ========================================

-- Add area field (this might already exist)
ALTER TABLE `ll_rubros` 
ADD COLUMN IF NOT EXISTS `area` varchar(100) DEFAULT NULL AFTER `id`;

-- Add fuente_id field (this might already exist)
ALTER TABLE `ll_rubros` 
ADD COLUMN IF NOT EXISTS `fuente_id` int(11) DEFAULT 2 AFTER `busqueda`;

-- Add foreign key constraint for fuente_id (only if it doesn't exist)
SET @constraint_exists = (
    SELECT COUNT(*) 
    FROM information_schema.TABLE_CONSTRAINTS 
    WHERE CONSTRAINT_NAME = 'fk_rubros_fuente' 
    AND TABLE_NAME = 'll_rubros' 
    AND TABLE_SCHEMA = DATABASE()
);

SET @sql = IF(@constraint_exists = 0, 
    'ALTER TABLE `ll_rubros` ADD CONSTRAINT `fk_rubros_fuente` FOREIGN KEY (`fuente_id`) REFERENCES `ll_fuentes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE',
    'SELECT "Foreign key constraint already exists" as message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ========================================
-- 6. Add indexes for better performance
-- ========================================

-- Index on ll_lugares for WhatsApp fields
CREATE INDEX IF NOT EXISTS `idx_telefono_wapp` ON `ll_lugares` (`telefono_wapp`);
CREATE INDEX IF NOT EXISTS `idx_wapp_valido` ON `ll_lugares` (`wapp_valido`);

-- Index on ll_envios_whatsapp for better query performance
CREATE INDEX IF NOT EXISTS `idx_estado_envio` ON `ll_envios_whatsapp` (`estado`);
CREATE INDEX IF NOT EXISTS `idx_fecha_envio` ON `ll_envios_whatsapp` (`fecha_envio`);
CREATE INDEX IF NOT EXISTS `idx_lugar_id` ON `ll_envios_whatsapp` (`lugar_id`);

-- Index on ll_campanias_whatsapp
CREATE INDEX IF NOT EXISTS `idx_estado_campania` ON `ll_campanias_whatsapp` (`estado`);
CREATE INDEX IF NOT EXISTS `idx_fecha_creacion` ON `ll_campanias_whatsapp` (`fecha_creacion`);