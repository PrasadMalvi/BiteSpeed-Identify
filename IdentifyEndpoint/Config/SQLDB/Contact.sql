CREATE TABLE Contact (
    id INT PRIMARY KEY AUTO_INCREMENT,
    phoneNumber VARCHAR(20),
    email VARCHAR(255),
    linkedId INT NULL, -- Points to the primary contact if secondary
    linkPrecedence ENUM('primary', 'secondary') NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP NULL,
    FOREIGN KEY (linkedId) REFERENCES Contact(id) ON DELETE CASCADE
);