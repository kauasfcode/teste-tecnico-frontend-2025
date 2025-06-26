"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getAdressByCep } from "./services/getAdressByCep"
import { deleteContact, getAllContacts, saveContact, updateContactDisplayName } from "./services/ContactRepository"
import type { Contact } from "./interfaces/IContact"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./components/ui/dialog"

export default function App() {
  const [username, setUsername] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [cep, setCep] = useState("")
  const [view, setView] = useState<"form" | "list">("form")

  const [filterUsername, setFilterUsername] = useState("")
  const [filterCity, setFilterCity] = useState("")
  const [filterState, setFilterState] = useState("")
  const [searchDisplayName, setSearchDisplayName] = useState("")
  const [contacts, setContacts] = useState<Contact[]>([])

  const [editingContactId, setEditingContactId] = useState<string | null>(null)
  const [newDisplayName, setNewDisplayName] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if ([username, displayName, cep].some((field) => !field.trim())) {
      alert("Por favor, preencha todos os campos")
      return
    } else {
      try {
        const adress = await getAdressByCep(cep.replace(/\D/g, "").trim())
        const newContact = {
          id: Date.now().toString() + Math.random().toString(36).substring(2),
          username: username,
          address: adress,
          displayName: displayName,
        } as Contact
        saveContact(newContact)
        alert("Contato salvo com sucesso!")
      } catch (e) {
        alert(e)
      }
    }
  }
  function handleUpdateDisplayName() {
    if (!editingContactId || !newDisplayName.trim()) return
    updateContactDisplayName(editingContactId, newDisplayName.trim())
    setContacts(getAllContacts())
    setEditingContactId(null)
    setNewDisplayName("")
  }

  function handleApplyFilters() {
    let contacts = getAllContacts()

    if (filterUsername.trim()) {
      contacts = contacts.filter((contact) => contact.username === filterUsername.trim())
    }

    if (filterCity.trim()) {
      contacts = contacts.filter(
        (contact) => contact.address.localidade.toLowerCase() === filterCity.trim().toLowerCase(),
      )
    }

    if (filterState.trim()) {
      contacts = contacts.filter((contact) => contact.address.uf.toLowerCase() === filterState.trim().toLowerCase())
    }

    if (searchDisplayName.trim()) {
      contacts = contacts.filter((contact) =>
        contact.displayName.toLowerCase().includes(searchDisplayName.trim().toLowerCase()),
      )
    }

    setContacts(contacts)
  }

  useEffect(() => {
    if (view === "list") {
      setContacts(getAllContacts())
    }
  }, [view])

  return (
    <div className="min-h-screen bg-gray-100 py-8 font-sans">
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        <div className="flex justify-center gap-4">
          <Button
            variant={view === "form" ? "default" : "outline"}
            onClick={() => setView("form")}
            className={
              view === "form" ? "bg-black hover:bg-gray-800 text-white" : "border-black text-black hover:bg-gray-100"
            }
          >
            Adicionar Contato
          </Button>
          <Button
            variant={view === "list" ? "default" : "outline"}
            onClick={() => setView("list")}
            className={
              view === "list" ? "bg-black hover:bg-gray-800 text-white" : "border-black text-black hover:bg-gray-100"
            }
          >
            Lista de Contatos
          </Button>
        </div>

        {/* Formulário */}
        {view === "form" && (
          <Card className="shadow-xl border-2 border-gray-300 bg-white">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="text-xl font-bold text-black">Informações do Usuário</CardTitle>
              <CardDescription className="text-gray-600">Preencha suas informações pessoais abaixo</CardDescription>
            </CardHeader>
            <CardContent className="text-black">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Nome de usuário</Label>
                  <Input
                    id="username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Digite seu nome de usuário"
                    className="border-black  placeholder:text-gray-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="displayName">Nome de exibição</Label>
                  <Input
                    id="displayName"
                    name="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Como você gostaria de chamar esse endereço"
                    className="border-black text-black placeholder:text-gray-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cep">CEP</Label>
                  <Textarea
                    id="cep"
                    name="cep"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    placeholder="Digite o CEP"
                    className="min-h-[80px] border-black text-black placeholder:text-gray-500"
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white font-medium">
                  Salvar Informações
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Lista de contatos com filtros */}
        {view === "list" && (
          <Card className="shadow-xl border-2 border-gray-300 bg-white">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="text-xl font-bold text-black">Lista de Contatos</CardTitle>
              <CardDescription className="text-gray-600">Filtre e gerencie seus contatos cadastrados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-black">
              {/* Filtros */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="filterUsername">Filtrar por usuário</Label>
                  <Input
                    id="filterUsername"
                    placeholder="Usuário"
                    value={filterUsername}
                    onChange={(e) => setFilterUsername(e.target.value)}
                    className="border-black  placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <Label htmlFor="filterCity">Filtrar por cidade</Label>
                  <Input
                    id="filterCity"
                    placeholder="Cidade"
                    value={filterCity}
                    onChange={(e) => setFilterCity(e.target.value)}
                    className="border-black  placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <Label htmlFor="filterState">Filtrar por estado</Label>
                  <Input
                    id="filterState"
                    placeholder="UF"
                    value={filterState}
                    onChange={(e) => setFilterState(e.target.value)}
                    className="border-black  placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="searchDisplayName">Buscar por nome de exibição</Label>
                <Input
                  id="searchDisplayName"
                  placeholder="Ex: Casa da Mãe"
                  value={searchDisplayName}
                  onChange={(e) => setSearchDisplayName(e.target.value)}
                  className="border-black  placeholder:text-gray-500"
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleApplyFilters} className="bg-black hover:bg-gray-800 text-white">
                  Aplicar Filtros
                </Button>
              </div>

              <div className="space-y-4">
                {contacts.map((contact) => (
                  <Card
                    key={contact.id}
                    className="border-l-4 border-l-black shadow-lg hover:shadow-xl transition-shadow bg-white border-2 border-gray-200"
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-black font-bold">{contact.displayName}</CardTitle>
                      <CardDescription className="text-gray-600">
                        @{contact.username} - {contact.address.localidade} / {contact.address.uf}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-gray-500">
                        {contact.address.logradouro}, {contact.address.bairro} - {contact.address.cep}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-400 text-gray-700 hover:bg-gray-50 bg-transparent"
                          onClick={
                            () => {
                              setEditingContactId(contact.id)
                              setNewDisplayName(contact.displayName)
                            }
                          }
                        >
                          Editar
                        </Button>
                        <Button size="sm"
                          className="bg-gray-800 hover:bg-black text-white"
                          onClick={() => {
                            deleteContact(contact.id)
                            setContacts(getAllContacts())
                          }}>
                          Excluir
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Modal para editar displayName */}
        <Dialog open={!!editingContactId} onOpenChange={() => setEditingContactId(null)}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle className="text-black">Editar Nome de Exibição</DialogTitle>
            </DialogHeader>
            <Input
              value={newDisplayName}
              onChange={(e) => setNewDisplayName(e.target.value)}
              placeholder="Novo nome de exibição"
              className="border border-black text-black"
            />
            <DialogFooter>
              <Button onClick={handleUpdateDisplayName} className="bg-black text-white"
              >
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div >
  )
}
