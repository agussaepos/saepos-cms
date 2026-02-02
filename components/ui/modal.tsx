import { HTMLAttributes, ReactNode, forwardRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "./button";

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      className,
      isOpen,
      onClose,
      title,
      description,
      size = "md",
      children,
      ...props
    },
    ref,
  ) => {
    // Close on Escape key
    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      if (isOpen) {
        document.addEventListener("keydown", handleEscape);
        document.body.style.overflow = "hidden";
      }
      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "unset";
      };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizes = {
      sm: "max-w-md",
      md: "max-w-lg",
      lg: "max-w-2xl",
      xl: "max-w-4xl",
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal Content */}
        <div
          ref={ref}
          className={cn(
            "relative z-50 w-full bg-white rounded-xl shadow-2xl border border-zinc-200",
            sizes[size],
            className,
          )}
          role="dialog"
          aria-modal="true"
          {...props}
        >
          {/* Header */}
          {(title || description) && (
            <div className="px-6 py-4 border-b border-zinc-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {title && (
                    <h2 className="text-xl font-semibold text-zinc-900">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p className="text-sm text-zinc-500 mt-1">{description}</p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="ml-4 text-zinc-400 hover:text-zinc-900 transition-colors p-1 rounded-lg hover:bg-zinc-100"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Body */}
          <div className="px-6 py-4">{children}</div>
        </div>
      </div>
    );
  },
);

Modal.displayName = "Modal";

const ModalFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-200 bg-zinc-50",
        className,
      )}
      {...props}
    />
  ),
);
ModalFooter.displayName = "ModalFooter";

export { Modal, ModalFooter };
