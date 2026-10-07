// =================================================================
// FILE: app/admin/notifications/_components/NotificationManagementClient.jsx
// =================================================================
'use client'
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import NotificationForm from './NotificationForm';
import { deleteNotification }  from '@/crud/coreCrud';

const NotificationManagementClient = ({ 
  orderId, 
  orderData = null, // Add orderData prop
  notificationData = null, 
  initialNotifications = [], 
  session,
  mode = 'add' // 'add' or 'edit'
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSuccess = () => {
    setIsDialogOpen(false);
    // Refresh the page to show updated data
    window.location.reload();
  };

  const handleDelete = async () => {
    if (!notificationData?.id) return;
    
    setIsDeleting(true);
    try {
      await deleteNotification(session.jwt, notificationData.id);
      toast.success('Notification deleted successfully!');
      setIsDeleteDialogOpen(false);
      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    } finally {
      setIsDeleting(false);
    }
  };

  if (mode === 'edit') {
    return (
      <div className="flex space-x-2">
        {/* Edit Button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="text-xs px-2 py-1 text-gray-700">
              <Edit className="w-3 h-3 mr-1" />
              Edit
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Notification - {notificationData?.manager_name}</DialogTitle>
            </DialogHeader>
            <NotificationForm 
              notificationData={notificationData}
              orderData={orderData} // Pass order data to form
              onSuccess={handleSuccess}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Button */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="destructive" className="text-xs px-2 py-1">
              <Trash2 className="w-3 h-3 mr-1" />
              Delete
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Notification</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-gray-600">
                Are you sure you want to delete the notification for{' '}
                <strong>{notificationData?.manager_name}</strong>?
              </p>
              <p className="text-sm text-gray-500 mt-2">
                This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Notification'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Add mode (default)
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-1" />
          Add Notification
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Notification</DialogTitle>
        </DialogHeader>
        <NotificationForm 
          notificationData={{ order_id: orderId }}
          orderData={orderData} // Pass order data to form for add mode too
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
};

export default NotificationManagementClient;