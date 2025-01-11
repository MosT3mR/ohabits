export interface Database {
  public: {
    Tables: {
      habits: {
        Row: {
          id: string
          name: string
          user_id: string
          scheduled_days: boolean[]
          created_at: string
        }
        Insert: {
          name: string
          user_id: string
          scheduled_days?: boolean[]
        }
      }
      habit_completions: {
        Row: {
          id: string
          habit_id: string
          user_id: string
          completed: boolean
          date: string
          created_at: string
        }
        Insert: {
          habit_id: string
          user_id: string
          completed: boolean
          date: string
        }
      }
    }
  }
} 