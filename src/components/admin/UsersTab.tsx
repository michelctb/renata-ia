
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { Cliente, updateCliente, deleteCliente, addCliente } from '@/lib/clientes';
import UserManagementDialog from '@/components/admin/UserManagementDialog';
import { useAuth } from '@/contexts/AuthContext';

interface UsersTabProps {
  clients: Cliente[];
  isLoading: boolean;
  loadClients: () => Promise<void>;
}

const UsersTab: React.FC<UsersTabProps> = ({
  clients,
  isLoading,
  loadClients
}) => {
  const {
    user,
    isAdmin
  } = useAuth();
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Cliente | null>(null);

  const handleEditUser = (client: Cliente) => {
    setEditingUser({
      ...client
    });
    setIsAddUserDialogOpen(true);
  };

  const handleDeleteUser = async (clientId: string) => {
    if (!confirm('Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.')) {
      return;
    }
    try {
      await deleteCliente(clientId);
      toast.success('Cliente excluído com sucesso');
      loadClients(); // Recarregar a lista após exclusão
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Erro ao excluir cliente');
    }
  };

  const handleUserSave = async (client: Cliente) => {
    try {
      if (editingUser) {
        // Atualizar usuário existente
        await updateCliente(client);
        toast.success('Cliente atualizado com sucesso');
      } else {
        // Gerar ID para novo usuário
        const newClientId = crypto.randomUUID().substring(0, 8);

        // Criar novo usuário com ID gerado e consultor associado (se aplicável)
        const newClient = {
          ...client,
          id_cliente: newClientId,
          consultor: !isAdmin() && user?.id ? user.id : null,
          plano: !isAdmin() ? 'Consultorado' : client.plano, // Define o plano como 'Consultorado' para clientes adicionados por consultores
          perfil: 'consultorado' // Definir o perfil como 'consultorado' para usuários adicionados por consultores
        };

        // Adicionar usuário
        await addCliente(newClient);
        toast.success('Cliente adicionado com sucesso');
      }
      setIsAddUserDialogOpen(false);
      setEditingUser(null);
      loadClients(); // Recarregar a lista após adicionar/atualizar
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('Erro ao salvar cliente');
    }
  };

  // Função para formatar o número de telefone
  const formatPhoneNumber = (phone: string | undefined) => {
    if (!phone) return '-';
    // Remove a parte @s.whatsapp.net se existir
    return phone.split('@')[0] || phone;
  };

  const isConsultorView = !isAdmin();

  return <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Gerenciamento de Clientes</CardTitle>
            <CardDescription>
              {isAdmin() ? 'Visualize e gerencie todos os usuários do sistema' : 'Visualize e gerencie os clientes vinculados a você'}
            </CardDescription>
          </div>
          <Button onClick={() => {
          setEditingUser(null);
          setIsAddUserDialogOpen(true);
        }} className="flex items-center gap-1">
            <UserPlus className="h-4 w-4" />
            {isAdmin() ? 'Novo Usuário' : 'Novo Cliente'}
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? <div className="flex justify-center py-8">Carregando...</div> : <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    {isAdmin() && <TableHead>ID</TableHead>}
                    <TableHead>Telefone</TableHead>
                    <TableHead>Email</TableHead>
                    {isAdmin() && (
                      <>
                        <TableHead>Plano</TableHead>
                        <TableHead>Perfil</TableHead>
                      </>
                    )}
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.length === 0 ? <TableRow>
                      <TableCell colSpan={isConsultorView ? 4 : 8} className="text-center py-6 text-muted-foreground">
                        Nenhum {isAdmin() ? 'usuário' : 'cliente'} encontrado
                      </TableCell>
                    </TableRow> : clients.map(client => <TableRow key={client.id_cliente}>
                        <TableCell className="font-medium">{client.nome || '-'}</TableCell>
                        {isAdmin() && <TableCell>{client.id_cliente}</TableCell>}
                        <TableCell>{formatPhoneNumber(client.telefone)}</TableCell>
                        <TableCell>{client.email || '-'}</TableCell>
                        {isAdmin() && (
                          <>
                            <TableCell>{client.plano || '-'}</TableCell>
                            <TableCell>{client.perfil || 'user'}</TableCell>
                          </>
                        )}
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${client.ativo ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                            {client.ativo ? 'Ativo' : 'Inativo'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditUser(client)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(client.id_cliente)} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>)}
                </TableBody>
              </Table>
            </div>}
        </CardContent>
      </Card>
      
      {/* Diálogo de Gestão de Usuários */}
      <UserManagementDialog isOpen={isAddUserDialogOpen} onClose={() => {
      setIsAddUserDialogOpen(false);
      setEditingUser(null);
    }} onSave={handleUserSave} userToEdit={editingUser} isAdminMode={isAdmin()} />
    </>;
};
export default UsersTab;
