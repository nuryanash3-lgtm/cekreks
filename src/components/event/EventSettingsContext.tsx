"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type SaveHandler = () => Promise<{ ok: boolean; message?: string }>;

interface EventSettingsContextValue {
  registerSaveHandler: (handler: SaveHandler | null) => void;
  triggerSave: () => Promise<void>;
  hasSaveHandler: boolean;
  isSaving: boolean;
  saveStatus: { type: "success" | "error"; message: string } | null;
  clearSaveStatus: () => void;
}

const EventSettingsContext = createContext<EventSettingsContextValue | null>(null);

export function EventSettingsSaveProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const handlerRef = useRef<SaveHandler | null>(null);
  const [hasSaveHandler, setHasSaveHandler] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const registerSaveHandler = useCallback((handler: SaveHandler | null) => {
    handlerRef.current = handler;
    setHasSaveHandler(Boolean(handler));
  }, []);

  const clearSaveStatus = useCallback(() => {
    setSaveStatus(null);
  }, []);

  const triggerSave = useCallback(async () => {
    if (isSaving) return;
    const handler = handlerRef.current;
    if (!handler) {
      setSaveStatus({
        type: "success",
        message: "Pengaturan tab ini belum tersambung ke server.",
      });
      return;
    }

    setIsSaving(true);
    setSaveStatus(null);
    try {
      const result = await handler();
      setSaveStatus({
        type: result.ok ? "success" : "error",
        message:
          result.message ||
          (result.ok
            ? "Pengaturan event berhasil disimpan!"
            : "Gagal menyimpan pengaturan event."),
      });
    } catch (error) {
      setSaveStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Gagal menyimpan pengaturan event.",
      });
    } finally {
      setIsSaving(false);
    }
  }, [isSaving]);

  useEffect(() => {
    if (!saveStatus) return;
    const timer = setTimeout(() => setSaveStatus(null), 4000);
    return () => clearTimeout(timer);
  }, [saveStatus]);

  const value = useMemo(
    () => ({
      registerSaveHandler,
      triggerSave,
      hasSaveHandler,
      isSaving,
      saveStatus,
      clearSaveStatus,
    }),
    [
      registerSaveHandler,
      triggerSave,
      hasSaveHandler,
      isSaving,
      saveStatus,
      clearSaveStatus,
    ]
  );

  return (
    <EventSettingsContext.Provider value={value}>
      {children}
    </EventSettingsContext.Provider>
  );
}

export function useEventSettingsSave() {
  return useContext(EventSettingsContext);
}

export function useRegisterSettingsSave(handler: SaveHandler) {
  const ctx = useContext(EventSettingsContext);
  const registerSaveHandler = ctx?.registerSaveHandler;
  const latestHandlerRef = useRef(handler);

  useEffect(() => {
    latestHandlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!registerSaveHandler) return;
    const wrappedHandler: SaveHandler = () => latestHandlerRef.current();
    registerSaveHandler(wrappedHandler);
    return () => {
      registerSaveHandler(null);
    };
  }, [registerSaveHandler]);
}
