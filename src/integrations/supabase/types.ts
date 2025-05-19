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
          adesao: number | null
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
          recorrencia: number | null
          telefone: string | null
          valor: number | null
        }
        Insert: {
          adesao?: number | null
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
          recorrencia?: number | null
          telefone?: string | null
          valor?: number | null
        }
        Update: {
          adesao?: number | null
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
          recorrencia?: number | null
          telefone?: string | null
          valor?: number | null
        }
        Relationships: []
      }
      dashboard_preferences: {
        Row: {
          created_at: string | null
          favorites: Json | null
          id: string
          layout: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          favorites?: Json | null
          id?: string
          layout?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          favorites?: Json | null
          id?: string
          layout?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      financas_historicas: {
        Row: {
          ano: number
          created_at: string | null
          despesas: number | null
          id: string
          mes: number
          receitas: number | null
          tipo: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ano: number
          created_at?: string | null
          despesas?: number | null
          id?: string
          mes: number
          receitas?: number | null
          tipo: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ano?: number
          created_at?: string | null
          despesas?: number | null
          id?: string
          mes?: number
          receitas?: number | null
          tipo?: string
          updated_at?: string | null
          user_id?: string
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
      calcular_tendencia_financeira: {
        Args: { p_user_id: string; p_meses?: number }
        Returns: {
          mes: number
          ano: number
          receitas: number
          despesas: number
          balanco: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
