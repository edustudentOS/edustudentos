import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  useNotifications,
  useCreateNotification,
  useToggleNotificationActive,
  useDeleteNotification,
} from "@/hooks/useAdminNotifications";
import { Bell, Plus, Trash2, ToggleLeft, ToggleRight, Megaphone } from "lucide-react";
import { format } from "date-fns";

export default function AdminNotifications() {
  const { toast } = useToast();
  const { data: notifications, isLoading } = useNotifications();
  const createNotification = useCreateNotification();
  const toggleActive = useToggleNotificationActive();
  const deleteNotification = useDeleteNotification();

  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ title: "", message: "", type: "notification", expires_at: "" });

  const handleCreate = async () => {
    await createNotification.mutateAsync({
      ...form,
      expires_at: form.expires_at || null,
    });
    setForm({ title: "", message: "", type: "notification", expires_at: "" });
    setCreateOpen(false);
    toast({ title: "Notification sent" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground">Send announcements and alerts to users</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />New Notification</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Notification</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <Textarea placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="notification">App Notification</SelectItem>
                  <SelectItem value="popup">Popup Alert</SelectItem>
                  <SelectItem value="banner">Banner</SelectItem>
                  <SelectItem value="announcement">Announcement</SelectItem>
                </SelectContent>
              </Select>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Expires At (optional)</label>
                <Input type="datetime-local" value={form.expires_at} onChange={(e) => setForm({ ...form, expires_at: e.target.value })} />
              </div>
              <Button onClick={handleCreate} disabled={!form.title || !form.message || createNotification.isPending} className="w-full">Send</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Bell className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{notifications?.length ?? 0}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
              <Megaphone className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{notifications?.filter((n) => n.is_active).length ?? 0}</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
              <Bell className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{notifications?.filter((n) => !n.is_active).length ?? 0}</p>
              <p className="text-xs text-muted-foreground">Inactive</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notifications?.map((n) => (
                  <TableRow key={n.id}>
                    <TableCell className="font-medium">{n.title}</TableCell>
                    <TableCell><Badge variant="outline">{n.type}</Badge></TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{n.message}</TableCell>
                    <TableCell>
                      <Badge variant={n.is_active ? "default" : "secondary"}>
                        {n.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(n.created_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" onClick={() => toggleActive.mutate({ id: n.id, is_active: !n.is_active })}>
                          {n.is_active ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => deleteNotification.mutate(n.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {notifications?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">No notifications yet</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
