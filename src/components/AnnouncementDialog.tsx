import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ANNOUNCEMENT_KEY = "tennis_announcement_seen_v1";

export default function AnnouncementDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(ANNOUNCEMENT_KEY);
    if (!seen) {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem(ANNOUNCEMENT_KEY, "true");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">
            🎾 场地预订须知 🎾
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 text-sm text-foreground leading-relaxed py-2">
          <p>
            👋 嗨，各位球友们！欢迎来到我们的网球场预订系统～
          </p>
          <p>
            ⏰ <strong>抢场规则：</strong>每天早晨 <strong>7:00</strong> 准时开抢当天场地，手速决定一切！先到先得，犹豫就会败北 😤🔥
          </p>
          <p>
            💰 <strong>收费标准：</strong>60元/小时，童叟无欺～没抢到的话 <strong>全额退款</strong>，放心大胆地冲！💪
          </p>
          <p>
            ⚠️ <strong>重要提醒：</strong>预订成功后 <strong>不可临时取消</strong> 哦！所以下手前请三思，确认好时间再提交～🤔
          </p>
          <p>
            📱 <strong>预约入校：</strong>提交预订后，请添加管理员微信 <strong className="text-primary">Koi_Menace00</strong>，提供 🐟咸鱼下单截图 + 个人信息，完成入校预约流程 ✅
          </p>
          <p className="text-muted-foreground text-xs pt-2 text-center">
            祝各位球技日日精进，ACE不断！🏆🎉
          </p>
        </div>
        <DialogFooter>
          <Button onClick={handleClose} className="w-full rounded-xl">
            我知道啦，开始预订！🚀
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
