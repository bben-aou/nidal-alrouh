'use client';

import { Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { useDeleteReflection } from '@/apis/journal/queries';
import { EditReflectionDialog } from '@/components/journal/edit-reflection-dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { JournalReflection as JournalReflectionType } from '@/lib/mock-data/journal';

interface ReflectionActionsProps {
  entry: JournalReflectionType;
  isCurrentUserAuthor: boolean;
}

export function ReflectionActions({
  entry,
  isCurrentUserAuthor,
}: Readonly<ReflectionActionsProps>) {
  const t = useTranslations('journal');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const deleteReflectionMutation = useDeleteReflection();

  const handleDelete = () => {
    deleteReflectionMutation.deleteReflection({ id: String(entry.id) });
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      {isCurrentUserAuthor && <EditReflectionDialog entry={entry} />}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            disabled={deleteReflectionMutation.isPending}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t('dashboard.delete_reflection')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('dashboard.delete_reflection_confirmation')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-2 sm:rtl:flex-row-reverse">
            <AlertDialogCancel className="mt-2 sm:mt-0">
              {t('dashboard.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteReflectionMutation.isPending}
              className="sm:ms-2"
            >
              {deleteReflectionMutation.isPending
                ? t('dashboard.deleting')
                : t('dashboard.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
