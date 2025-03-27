export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      "Aviso manutenção": {
        Row: {
          cliente: string | null
          created_at: string
          id: number
        }
        Insert: {
          cliente?: string | null
          created_at: string
          id?: number
        }
        Update: {
          cliente?: string | null
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      Categorias: {
        Row: {
          cliente: string | null
          created_at: string
          id: number
          nome: string
          padrao: boolean | null
          tipo: string
        }
        Insert: {
          cliente?: string | null
          created_at?: string
          id?: number
          nome: string
          padrao?: boolean | null
          tipo: string
        }
        Update: {
          cliente?: string | null
          created_at?: string
          id?: number
          nome?: string
          padrao?: boolean | null
          tipo?: string
        }
        Relationships: []
      }
      Clientes: {
        Row: {
          ativo: boolean | null
          consultor: string | null
          cpf: number | null
          created_at: string
          email: string | null
          id_cliente: string
          lembrete: string | null
          nome: string | null
          perfil: string | null
          plano: string | null
          telefone: string | null
          valor: number | null
        }
        Insert: {
          ativo?: boolean | null
          consultor?: string | null
          cpf?: number | null
          created_at?: string
          email?: string | null
          id_cliente?: string
          lembrete?: string | null
          nome?: string | null
          perfil?: string | null
          plano?: string | null
          telefone?: string | null
          valor?: number | null
        }
        Update: {
          ativo?: boolean | null
          consultor?: string | null
          cpf?: number | null
          created_at?: string
          email?: string | null
          id_cliente?: string
          lembrete?: string | null
          nome?: string | null
          perfil?: string | null
          plano?: string | null
          telefone?: string | null
          valor?: number | null
        }
        Relationships: []
      }
      "Informações Clientes": {
        Row: {
          ativo: boolean | null
          cpf: number | null
          created_at: string
          email: string | null
          id: number
          Lembrete: string | null
          Nome: string | null
          plano: string | null
          Telefone: string | null
        }
        Insert: {
          ativo?: boolean | null
          cpf?: number | null
          created_at: string
          email?: string | null
          id?: number
          Lembrete?: string | null
          Nome?: string | null
          plano?: string | null
          Telefone?: string | null
        }
        Update: {
          ativo?: boolean | null
          cpf?: number | null
          created_at?: string
          email?: string | null
          id?: number
          Lembrete?: string | null
          Nome?: string | null
          plano?: string | null
          Telefone?: string | null
        }
        Relationships: []
      }
      Lembretes: {
        Row: {
          cliente: string | null
          id: number
          id_cliente: string | null
          lembrar: string | null
          lembrete: string | null
          telefone: string | null
          tipo: string | null
          valor: number | null
          vencimento: string
        }
        Insert: {
          cliente?: string | null
          id?: number
          id_cliente?: string | null
          lembrar?: string | null
          lembrete?: string | null
          telefone?: string | null
          tipo?: string | null
          valor?: number | null
          vencimento: string
        }
        Update: {
          cliente?: string | null
          id?: number
          id_cliente?: string | null
          lembrar?: string | null
          lembrete?: string | null
          telefone?: string | null
          tipo?: string | null
          valor?: number | null
          vencimento?: string
        }
        Relationships: []
      }
      metas_categorias: {
        Row: {
          ano_referencia: number | null
          categoria: string
          created_at: string
          id: number
          id_cliente: string
          mes_referencia: number | null
          periodo: string
          valor_meta: number
        }
        Insert: {
          ano_referencia?: number | null
          categoria: string
          created_at?: string
          id?: number
          id_cliente: string
          mes_referencia?: number | null
          periodo?: string
          valor_meta: number
        }
        Update: {
          ano_referencia?: number | null
          categoria?: string
          created_at?: string
          id?: number
          id_cliente?: string
          mes_referencia?: number | null
          periodo?: string
          valor_meta?: number
        }
        Relationships: []
      }
      "Sistema Financeiro": {
        Row: {
          categoria: string | null
          cliente: string | null
          created_at: string | null
          data: string
          descrição: string | null
          id: number
          id_cliente: string | null
          operação: string | null
          valor: number | null
        }
        Insert: {
          categoria?: string | null
          cliente?: string | null
          created_at?: string | null
          data: string
          descrição?: string | null
          id?: number
          id_cliente?: string | null
          operação?: string | null
          valor?: number | null
        }
        Update: {
          categoria?: string | null
          cliente?: string | null
          created_at?: string | null
          data?: string
          descrição?: string | null
          id?: number
          id_cliente?: string | null
          operação?: string | null
          valor?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
