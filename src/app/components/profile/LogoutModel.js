'use client';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";  

export function LogoutModal({ isOpen, onClose, onConfirm }) {

    const handleLogout = () => {
        toast.success("You have been logged out successfully!");  
        onConfirm(); 
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you sure you want to log out?</DialogTitle>
                    <DialogDescription>
                        This will end your current session.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <div className="flex w-full justify-between">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleLogout}>
                            Log Out    
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>    
    );
}
