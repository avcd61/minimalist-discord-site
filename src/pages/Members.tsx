import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Mic, MicOff, Volume2, VolumeX, Bot, Crown } from "lucide-react";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { subscribeToMembers, requestMemberUpdate, type DiscordMember } from "@/services/discord";
import { toast } from "sonner";

const Members = () => {
  const [members, setMembers] = useState<DiscordMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<DiscordMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cachedStatus, setCachedStatus] = useState<DiscordMember["status"] | null>(null);
  const lastSelectedMember = useRef<DiscordMember | null>(null);
  const isDialogOpen = useRef<boolean>(false);

  // Функция для получения и обновления данных
  const fetchAndUpdateMembers = useCallback(async () => {
    try {
      setIsLoading(true);
      await requestMemberUpdate(); // Принудительный запрос данных с сервера
    } catch (error) {
      console.error("Ошибка при обновлении данных:", error);
      toast.error(`Не удалось обновить данные: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let unsubscribe: () => void;

    const initializeConnection = async () => {
      // Запрашиваем данные при монтировании
      await fetchAndUpdateMembers();

      // Подписываемся на обновления
      unsubscribe = subscribeToMembers((newMembers) => {
        console.log("Обновленные участники:", newMembers);
        const updatedMembers = [...newMembers]
          .sort((a, b) => {
            if (a.isOwner) return -1;
            if (b.isOwner) return 1;
            const aMaxRolePosition = Math.max(...(a.roles.map((r) => r.position ?? -Infinity)));
            const bMaxRolePosition = Math.max(...(b.roles.map((r) => r.position ?? -Infinity)));
            return bMaxRolePosition - aMaxRolePosition;
          })
          .filter((m, idx, self) => idx === self.findIndex((t) => t.id === m.id));

        setMembers(updatedMembers);
        setIsLoading(false);

        if (isDialogOpen.current && selectedMember) {
          const updatedSelected = updatedMembers.find((m) => m.id === selectedMember.id) || null;
          if (updatedSelected) {
            console.log("Обновляем selectedMember:", updatedSelected);
            setSelectedMember(updatedSelected);
            lastSelectedMember.current = updatedSelected;
            setCachedStatus(updatedSelected.status);
          } else {
            console.warn("Не удалось найти обновленного участника для selectedMember");
          }
        }
      });
    };

    initializeConnection();

    // Очистка подписки при размонтировании
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [fetchAndUpdateMembers, selectedMember]); // Зависимость от selectedMember для обновления диалога

  const getRoleColor = (roleName: string, roles: { name: string; color?: string; position: number }[]) => {
    const role = roles.find((r) => r.name === roleName);
    return role?.color && role.color !== "#000000" ? role.color : "#e5e7eb";
  };

  const handleOpenDialog = useCallback((member: DiscordMember) => {
    const memberCopy = { ...member };
    setSelectedMember(memberCopy);
    lastSelectedMember.current = memberCopy;
    setCachedStatus(memberCopy.status);
    isDialogOpen.current = true;
    fetchAndUpdateMembers(); // Обновляем данные при открытии диалога
  }, [fetchAndUpdateMembers]);

  const handleCloseDialog = useCallback(() => {
    console.log("Закрываем диалог, последнее состояние:", lastSelectedMember.current);
    setSelectedMember(null);
    setCachedStatus(null);
    isDialogOpen.current = false;
  }, []);

  const sortedRoles = useMemo(
    () => (roles: DiscordMember["roles"]) => {
      return [...roles].sort((a, b) => b.position - a.position);
    },
    []
  );

  return (
    <div className="container max-w-4xl py-24 space-y-8">
      <div className="space-y-4">
        <div className="flex justify-center">
          <h1 className="text-4xl font-montserrat font-bold text-3d shadow-3d">
            Участники сервера
          </h1>
        </div>

        <button
          onClick={fetchAndUpdateMembers}
          className="p-2 bg-blue-500 text-white rounded"
          disabled={isLoading}
        >
          {isLoading ? "Обновление..." : "Обновить данные"}
        </button>

        <div className="grid gap-4">
          {isLoading ? (
            <p className="text-center text-muted-foreground">Загрузка участников...</p>
          ) : members.length === 0 ? (
            <p className="text-center text-muted-foreground">Нет участников на сервере</p>
          ) : (
            members.map((member) => (
              <div
                key={member.id}
                onClick={() => handleOpenDialog(member)}
                className={`p-4 rounded-lg glass-card hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer animate-fade-in hover:scale-105`}
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={member.avatar || ""} className="object-cover" />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white dark:border-gray-900 ${
                        member.status.online === true ? "bg-green-500" : "bg-gray-500"
                      }`}
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{member.name}</span>
                      {member.isOwner && <Crown className="h-4 w-4 text-yellow-500" />}
                      {member.status.mic && <Mic className="h-4 w-4 text-green-500" />}
                      {!member.status.mic && <MicOff className="h-4 w-4 text-red-500" />}
                      {member.status.sound && <Volume2 className="h-4 w-4 text-green-500" />}
                      {!member.status.sound && <VolumeX className="h-4 w-4 text-red-500" />}
                      {member.isBot && <Bot className="h-4 w-4 text-blue-500" />}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Присоединился: {member.joinedAt || "Неизвестно"}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {sortedRoles(member.roles).map((role) => (
                        <div key={role.name} className="flex items-center gap-1.5">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: getRoleColor(role.name, member.roles) }}
                          />
                          <span className="text-xs font-medium text-muted-foreground">
                            {role.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Dialog
        open={!!selectedMember}
        onOpenChange={(open) => {
          if (!open) {
            handleCloseDialog();
          } else {
            isDialogOpen.current = true;
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="relative">
                <Avatar>
                  <AvatarImage src={selectedMember?.avatar || ""} />
                  <AvatarFallback>{selectedMember?.name?.[0] || "?"}</AvatarFallback>
                </Avatar>
                <div
                  className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white dark:border-gray-900 ${
                    selectedMember?.status.online === true ? "bg-green-500" : "bg-gray-500"
                  }`}
                />
              </div>
              <span>{selectedMember?.name || "Неизвестный"}</span>
              {selectedMember?.isOwner && <Crown className="h-4 w-4 text-yellow-500" />}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              <strong>Статус:</strong> {selectedMember?.status.online === true ? "Онлайн" : "Оффлайн"}
            </p>
            <p className="flex items-center gap-2">
              <strong>Микрофон:</strong>
              {cachedStatus?.mic ?? selectedMember?.status.mic ? (
                <Mic className="h-4 w-4 text-green-500" />
              ) : (
                <MicOff className="h-4 w-4 text-red-500" />
              )}
              {cachedStatus?.mic ?? selectedMember?.status.mic ? "Включен" : "Выключен"}
            </p>
            <p className="flex items-center gap-2">
              <strong>Звук:</strong>
              {cachedStatus?.sound ?? selectedMember?.status.sound ? (
                <Volume2 className="h-4 w-4 text-green-500" />
              ) : (
                <VolumeX className="h-4 w-4 text-red-500" />
              )}
              {cachedStatus?.sound ?? selectedMember?.status.sound ? "Включен" : "Выключен"}
            </p>
            <p>
              <strong>Дата присоединения:</strong> {selectedMember?.joinedAt || "Неизвестно"}
            </p>
            <div>
              <strong>Роли:</strong>
              <div className="flex flex-wrap gap-2 mt-2">
                {sortedRoles(selectedMember?.roles || []).map((role) => (
                  <div key={role.name} className="flex items-center gap-1.5">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getRoleColor(role.name, selectedMember?.roles || []) }}
                    />
                    <span className="text-sm font-medium text-muted-foreground">
                      {role.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Members;