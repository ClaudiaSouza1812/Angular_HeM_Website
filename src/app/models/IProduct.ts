// Interface defining the structure for a product
export interface IProduct {
    id: number;             // Unique identifier for the product
    nome: string;          // Product name (in Portuguese)
    marca: string;         // Brand name
    tipo_de_produto: string;  // Product type (in Portuguese)
    cor: string;           // Color (in Portuguese)
    preco: number;         // Price
    descricao: string;     // Product description (in Portuguese)
    foto_principal: string;   // Main product photo URL
    foto_secundaria: string;  // Secondary product photo URL
    categoria: string;      // Product category (in Portuguese)
}
