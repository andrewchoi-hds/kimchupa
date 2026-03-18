"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { toast } from "@/stores/toastStore";

interface ReportModalProps {
  open: boolean;
  onClose: () => void;
  targetType: "post" | "comment" | "user";
  targetId: string;
}

const REASONS = [
  { value: "spam", label: "스팸 / 광고" },
  { value: "harassment", label: "괴롭힘 / 혐오 발언" },
  { value: "inappropriate", label: "부적절한 콘텐츠" },
  { value: "copyright", label: "저작권 침해" },
  { value: "other", label: "기타" },
] as const;

export default function ReportModal({ open, onClose, targetType, targetId }: ReportModalProps) {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reason) {
      toast.error("신고 사유 선택", "신고 사유를 선택해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetType,
          targetId,
          reason,
          description: description.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.message || "신고 접수에 실패했습니다.");
      }

      toast.success("신고 접수 완료", "신고가 정상적으로 접수되었습니다. 검토 후 조치하겠습니다.");
      setReason("");
      setDescription("");
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : "신고 접수에 실패했습니다.";
      toast.error("오류", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setReason("");
      setDescription("");
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="신고하기" size="sm">
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-foreground mb-3">신고 사유를 선택해주세요</p>
          <div className="space-y-2">
            {REASONS.map((r) => (
              <label
                key={r.value}
                className="flex items-center gap-3 p-3 rounded-[var(--radius)] border border-border hover:bg-muted/50 cursor-pointer transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5"
              >
                <input
                  type="radio"
                  name="report-reason"
                  value={r.value}
                  checked={reason === r.value}
                  onChange={(e) => setReason(e.target.value)}
                  className="accent-primary"
                />
                <span className="text-sm text-foreground">{r.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            상세 설명 (선택)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="추가 설명이 있다면 작성해주세요"
            className="w-full p-3 bg-muted rounded-[var(--radius)] border border-border resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground text-sm"
            rows={3}
            maxLength={500}
          />
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <Button variant="outline" size="sm" onClick={handleClose} disabled={isSubmitting}>
            취소
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={!reason}
          >
            신고하기
          </Button>
        </div>
      </div>
    </Modal>
  );
}
