import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShoppingBag, MessageCircle } from "lucide-react";
import PostBookingDialog from "@/components/PostBookingDialog";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function PaymentChoiceDialog({ open, onClose }: Props) {
  const [showXianyu, setShowXianyu] = useState(false);
  const [showWechat, setShowWechat] = useState(false);

  const handleClose = () => {
    setShowXianyu(false);
    setShowWechat(false);
    onClose();
  };

  if (showXianyu) {
    return <PostBookingDialog open={true} onClose={handleClose} />;
  }

  if (showWechat) {
    return <PostBookingDialog open={true} onClose={handleClose} startStep="wechat" />;
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg text-center">
            💰 选择支付方式
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground text-center">
          您当前余额不足，请选择支付方式完成预订
        </p>
        <div className="space-y-3 py-2">
          <Button
            onClick={() => setShowXianyu(true)}
            className="w-full rounded-xl h-12 text-sm"
            variant="default"
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            🐟 闲鱼下单
          </Button>
          <Button
            onClick={() => setShowWechat(true)}
            className="w-full rounded-xl h-12 text-sm"
            variant="outline"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            💬 微信直接转账
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
