"use client"

import type React from "react"

import { useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2, UserCheck, UserX } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { format } from "date-fns"

interface AdminUser {
  id: string
  email: string
  name: string | null
  avatar_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function AdminUsersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    is_active: true,
  })

  const queryClient = useQueryClient()

  // Fetch admin users
  const { data: adminUsers, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase.from("admin_users").select("*").order("created_at", { ascending: false })

      if (error) throw error
      return data as AdminUser[]
    },
  })

  // Create admin user
  const createAdminUser = useMutation({
    mutationFn: async (userData: { email: string; name: string; is_active: boolean }) => {
      const { data, error } = await supabase.from("admin_users").insert(userData).select().single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] })
      setIsDialogOpen(false)
      resetForm()
    },
  })

  // Update admin user
  const updateAdminUser = useMutation({
    mutationFn: async ({ id, ...userData }: { id: string } & Partial<AdminUser>) => {
      const { data, error } = await supabase
        .from("admin_users")
        .update({ ...userData, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] })
      setIsDialogOpen(false)
      resetForm()
    },
  })

  // Delete admin user
  const deleteAdminUser = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("admin_users").delete().eq("id", id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] })
    },
  })

  const resetForm = () => {
    setFormData({ email: "", name: "", is_active: true })
    setEditingUser(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingUser) {
        await updateAdminUser.mutateAsync({ id: editingUser.id, ...formData })
      } else {
        await createAdminUser.mutateAsync(formData)
      }
    } catch (error) {
      console.error("Failed to save admin user:", error)
    }
  }

  const handleEdit = (user: AdminUser) => {
    setEditingUser(user)
    setFormData({
      email: user.email,
      name: user.name || "",
      is_active: user.is_active,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure want to remove this admin user?")) {
      try {
        await deleteAdminUser.mutateAsync(id)
      } catch (error) {
        console.error("Failed to delete admin user:", error)
      }
    }
  }

  const toggleUserStatus = async (user: AdminUser) => {
    try {
      await updateAdminUser.mutateAsync({
        id: user.id,
        is_active: !user.is_active,
      })
    } catch (error) {
      console.error("Failed to toggle user status:", error)
    }
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Users</h1>
            <p className="text-gray-600">Manage admin access and permissions</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="bg-[#2568AC] hover:bg-[#1e5a9a]">
                <Plus className="w-4 h-4 mr-2" />
                Add Admin User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingUser ? "Edit Admin User" : "Add New Admin User"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="admin@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Admin User"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[#2568AC] hover:bg-[#1e5a9a]">
                    {editingUser ? "Update" : "Create"} User
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Admin Users ({adminUsers?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adminUsers?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>{user.name || "—"}</TableCell>
                    <TableCell>
                      <Badge variant={user.is_active ? "default" : "secondary"}>
                        {user.is_active ? (
                          <>
                            <UserCheck className="w-3 h-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <UserX className="w-3 h-3 mr-1" />
                            Inactive
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>{format(new Date(user.created_at), "MMM dd, yyyy")}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(user)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleUserStatus(user)}
                          className={user.is_active ? "text-orange-600" : "text-green-600"}
                        >
                          {user.is_active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
