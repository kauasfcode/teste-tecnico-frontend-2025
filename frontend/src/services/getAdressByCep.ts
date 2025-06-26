export interface GetAdressResponse {
    cep: string
    logradouro: string
    complemento: string
    unidade: string
    bairro: string
    localidade: string
    uf: string
    estado: string
    regiao: string
    ibge: string
    gia: string
    ddd: string
    siafi: string
}

interface GetAdressResponseWithError extends GetAdressResponse {
    erro?: boolean
}

export async function getAdressByCep(cep: string): Promise<GetAdressResponse> {
    try {
        const cleanedCep = cep.replace(/\D/g, "")
        const response = await fetch(`https://viacep.com.br/ws/${cleanedCep}/json/`)
        const adress = await response.json() as GetAdressResponseWithError
        if (!response.ok || adress.erro) {
            throw new Error()
        }
        return adress as GetAdressResponse
    } catch {
        throw new Error("O CEP informado não foi encontrado")
    }
}