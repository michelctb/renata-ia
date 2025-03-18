
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardHeader from '@/components/DashboardHeader';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { fetchClientes, fetchConsultorClients, Cliente, updateCliente, deleteCliente } from '@/lib/clientes';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Edit, Trash2, UserPlus } from 'lucide-react';
import UserManagementDialog from '@/components/admin/UserManagementDialog';

const Admin = () => {
  const { user, isAdmin, isConsultor } = useAuth();
  const navigate = useNavigate();
  const [clients, setClients] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('usuarios');
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Cliente | null>(null);

  useEffect(() => {
    // Verificar se o usuário está logado e tem permissões adequadas
    if (!user) {
      navigate('/');
      return;
    }

    if (!isAdmin() && !isConsultor()) {
      toast.error('Você não tem permissão para acessar esta página');
      navigate('/dashboard');
      return;
    }

    loadClients();
  }, [user, navigate, isAdmin, isConsultor]);

  const loadClients = async () => {
    setIsLoading(true);
    try {
      let loadedClients: Cliente[] = [];
      
      if (isAdmin()) {
        // Administradores veem todos os clientes
        loadedClients = await fetchClientes();
      } else if (isConsultor() && user?.id) {
        // Consultores veem apenas seus clientes
        loadedClients = await fetchConsultorClients(user.id);
      }
      
      setClients(loadedClients);
    } catch (error) {
      console.error('Error loading clients:', error);
      toast.error('Erro ao carregar lista de clientes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = (client: Cliente) => {
    setEditingUser({...client});
    setIsAddUserDialogOpen(true);
  };

  const handleDeleteUser = async (clientId: string) => {
    if (!confirm('Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.')) {
      return;
    }
    
    try {
      await deleteCliente(clientId);
      toast.success('Usuário excluído com sucesso');
      loadClients(); // Recarregar a lista após exclusão
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Erro ao excluir usuário');
    }
  };

  const handleUserSave = async (client: Cliente) => {
    try {
      if (editingUser) {
        // Atualizar usuário existente
        await updateCliente(client);
        toast.success('Usuário atualizado com sucesso');
      } else {
        // Criar novo usuário com consultor associado
        if (isConsultor() && user?.id) {
          client.consultor = user.id;
        }
        
        // Adicionar usuário
        await updateCliente(client);
        toast.success('Usuário adicionado com sucesso');
      }
      
      setIsAddUserDialogOpen(false);
      setEditingUser(null);
      loadClients(); // Recarregar a lista após adicionar/atualizar
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('Erro ao salvar usuário');
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      
      <main className="flex-1 p-6 container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Painel de Administração</h1>
          <Button onClick={() => navigate('/dashboard')}>
            Voltar para Dashboard
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-3 mb-8">
            <TabsTrigger value="usuarios">Usuários</TabsTrigger>
            <TabsTrigger value="planos">Planos</TabsTrigger>
            <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
          </TabsList>
          
          {/* Conteúdo da tab de Usuários */}
          <TabsContent value="usuarios" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Gerenciamento de Usuários</CardTitle>
                  <CardDescription>
                    {isAdmin() 
                      ? 'Visualize e gerencie todos os usuários do sistema' 
                      : 'Visualize e gerencie os usuários vinculados a você'}
                  </CardDescription>
                </div>
                <Button onClick={() => {setEditingUser(null); setIsAddUserDialogOpen(true);}} className="flex items-center gap-1">
                  <UserPlus className="h-4 w-4" />
                  Novo Usuário
                </Button>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">Carregando...</div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>ID</TableHead>
                          <TableHead>Telefone</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Plano</TableHead>
                          <TableHead>Perfil</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {clients.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                              Nenhum usuário encontrado
                            </TableCell>
                          </TableRow>
                        ) : (
                          clients.map((client) => (
                            <TableRow key={client.id_cliente}>
                              <TableCell className="font-medium">{client.nome || '-'}</TableCell>
                              <TableCell>{client.id_cliente}</TableCell>
                              <TableCell>{client.telefone || '-'}</TableCell>
                              <TableCell>{client.email || '-'}</TableCell>
                              <TableCell>{client.plano || '-'}</TableCell>
                              <TableCell>{client.perfil || 'user'}</TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs ${client.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                  {client.ativo ? 'Ativo' : 'Inativo'}
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => handleEditUser(client)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => handleDeleteUser(client.id_cliente)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Conteúdo da tab de Planos */}
          <TabsContent value="planos" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciamento de Planos</CardTitle>
                <CardDescription>
                  Configure os planos disponíveis para usuários e consultores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  {/* Planos para usuários */}
                  <Card>
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                      <CardTitle className="text-xl">Mensal</CardTitle>
                      <CardDescription>Para usuários</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="text-3xl font-bold mb-4">R$ 14,90<span className="text-sm font-normal">/mês</span></div>
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center">✓ Acesso completo</li>
                        <li className="flex items-center">✓ Recomendado para iniciantes</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                      <CardTitle className="text-xl">Semestral</CardTitle>
                      <CardDescription>Para usuários</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="text-3xl font-bold mb-4">R$ 12,90<span className="text-sm font-normal">/mês</span></div>
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center">✓ Acesso completo</li>
                        <li className="flex items-center">✓ Economia de 13%</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                      <CardTitle className="text-xl">Anual</CardTitle>
                      <CardDescription>Para usuários</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="text-3xl font-bold mb-4">R$ 9,90<span className="text-sm font-normal">/mês</span></div>
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center">✓ Acesso completo</li>
                        <li className="flex items-center">✓ Economia de 33%</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Conteúdo da tab de Relatórios */}
          <TabsContent value="relatorios" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Relatórios Financeiros</CardTitle>
                <CardDescription>
                  Visualize relatórios consolidados de todos os usuários
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  Funcionalidade de relatórios a ser implementada em breve
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Diálogo de Gestão de Usuários */}
      <UserManagementDialog 
        isOpen={isAddUserDialogOpen}
        onClose={() => {
          setIsAddUserDialogOpen(false);
          setEditingUser(null);
        }}
        onSave={handleUserSave}
        userToEdit={editingUser}
        isAdminMode={isAdmin()}
      />
    </div>
  );
};

export default Admin;
