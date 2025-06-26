import type { GetAdressResponse } from "@/services/getAdressByCep"

export interface Contact {
  id: string
  username: string
  displayName: string
  address: GetAdressResponse
}