export type UserRole =
  | "comprador"
  | "vendedor"
  | "transportista"
  | "financiera"
  | "inversionista"
  | "admin";

export type OrderStatus =
  | "creado"
  | "pagado_en_escrow"
  | "en_preparacion"
  | "en_transito"
  | "entregado"
  | "liberado"
  | "en_disputa"
  | "reembolsado";

export type EscrowStatus =
  | "pendiente"
  | "fondos_recibidos"
  | "liberacion_parcial"
  | "liberado"
  | "en_disputa"
  | "reembolsado";

export interface Profile {
  id: string;
  created_at: string;
  updated_at: string;
  email: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  avatar_url?: string;
  rol: UserRole;
  ubicacion?: string;
  estado?: string;
  municipio?: string;
  ciclo_productivo_activo?: string;
  cultivo_principal?: string;
  terra_score?: number;
  terra_plus: boolean;
}

export interface Category {
  id: string;
  nombre: string;
  slug: string;
  descripcion?: string;
  imagen_url?: string;
  parent_id?: string;
  orden: number;
}

export interface Product {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string;
  store_id: string;
  category_id: string;
  precio_base: number;
  moneda: "USD" | "VES";
  stock: number;
  unidad: string;
  cultivo_objetivo?: string[];
  especie_objetivo?: string[];
  ciclo?: string[];
  principio_activo?: string;
  dosis_recomendada?: string;
  periodo_carencia?: string;
  contraindicaciones?: string;
  certificaciones?: string[];
  activo: boolean;
  created_at: string;
}

export interface Store {
  id: string;
  slug: string;
  nombre: string;
  descripcion?: string;
  logo_url?: string;
  banner_url?: string;
  ubicacion?: string;
  terra_score: number;
  verificada: boolean;
  owner_id: string;
  created_at: string;
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  variant_id?: string;
  cantidad: number;
  precio_unitario: number;
  product?: Product;
}

export interface Order {
  id: string;
  comprador_id: string;
  vendedor_id: string;
  store_id: string;
  status: OrderStatus;
  total: number;
  moneda: "USD" | "VES";
  direccion_entrega?: string;
  notas?: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  order_id: string;
  reviewer_id: string;
  rating: number;
  titulo?: string;
  contenido?: string;
  fotos?: string[];
  compra_verificada: boolean;
  created_at: string;
  reviewer?: Profile;
}

export interface Notification {
  id: string;
  user_id: string;
  tipo: "precio" | "stock" | "disputa" | "ciclo" | "pedido" | "mensaje";
  titulo: string;
  contenido: string;
  leida: boolean;
  url?: string;
  created_at: string;
}
