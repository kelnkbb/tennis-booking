import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import xianyuImg from "@/assets/xianyu-link.jpg";
import wechatImg from "@/assets/admin-wechat.jpg";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function PostBookingDialog({ open, onClose }: Props) {
  const [step, setStep] = useState<"xianyu" | "wechat">("xianyu");

  const handleClose = () => {
    setStep("xianyu");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="max-w-sm rounded-2xl">
        {step === "xianyu" ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-lg text-center">
                🐟 第一步：咸鱼下单
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <p className="text-sm text-muted-foreground text-center">
                请长按保存下方图片，打开闲鱼扫一扫完成下单 💰
              </p>
              <img
                src={xianyuImg}
                alt="咸鱼下单链接"
                className="w-full rounded-xl border border-border"
              />
            </div>
            <DialogFooter>
              <Button onClick={() => setStep("wechat")} className="w-full rounded-xl">
                已下单，下一步 ✅
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-lg text-center">
                💬 第二步：添加管理员微信
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <p className="text-sm text-muted-foreground text-center">
                扫码添加管理员微信 <strong className="text-primary">Koi_Menace00</strong>
                <br />
                发送咸鱼下单截图 + 个人信息，完成入校预约 🎾
              </p>
              <img
                src={wechatImg}
                alt="管理员微信二维码"
                className="w-full rounded-xl border border-border"
              />
            </div>
            <DialogFooter>
              <Button onClick={handleClose} className="w-full rounded-xl">
                我知道啦！🚀
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
