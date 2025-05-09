'use client';

import { CopyIcon, SquareArrowOutUpRightIcon } from 'lucide-react';
import { useState } from 'react';
import {
  BlueskyIcon,
  BlueskyShareButton,
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookMessengerIcon,
  FacebookMessengerShareButton,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TelegramIcon,
  TelegramShareButton,
  ThreadsIcon,
  ThreadsShareButton,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  XIcon,
} from 'react-share';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
  url: string;
}

export function SocialShareButton({ url }: Props) {
  const [open, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  function handleOpen() {
    setIsCopied(false);
    setIsOpen((prev) => !prev);
  }

  async function handleCopyUrl() {
    await navigator.clipboard.writeText(url);
    setIsCopied(true);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          Compartilhar
          <SquareArrowOutUpRightIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-8 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Diário de Glicemia</DialogTitle>
          <DialogDescription>
            Compartilhar histórico de medições
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              className="max-sm:text-sm"
              defaultValue={url}
              readOnly
            />
          </div>
          <Button
            type="submit"
            size="sm"
            className="px-3"
            aria-label="Copy link to clipboard"
            onClick={handleCopyUrl}
          >
            <span>{isCopied ? 'Copiado!' : 'Copiar'}</span>
            {!isCopied && <CopyIcon />}
          </Button>
        </div>
        <ShareButtons url={url} />
      </DialogContent>
    </Dialog>
  );
}

function ShareButtons({ url }: Props) {
  const iconSize = 40;
  const iconRound = true;
  const title = 'Confira o histórico de medições';

  return (
    <div className="flex-center flex-wrap gap-3">
      <WhatsappShareButton url={url} title={title} separator=": ">
        <WhatsappIcon size={iconSize} round={iconRound} />
      </WhatsappShareButton>

      <FacebookShareButton url={url}>
        <FacebookIcon size={iconSize} round={iconRound} />
      </FacebookShareButton>

      <FacebookMessengerShareButton url={url} appId="521270401588372">
        <FacebookMessengerIcon size={iconSize} round={iconRound} />
      </FacebookMessengerShareButton>

      <TwitterShareButton url={url} title={title}>
        <XIcon size={iconSize} round={iconRound} />
      </TwitterShareButton>

      <TelegramShareButton url={url} title={title}>
        <TelegramIcon size={iconSize} round={iconRound} />
      </TelegramShareButton>

      <LinkedinShareButton url={url}>
        <LinkedinIcon size={iconSize} round={iconRound} />
      </LinkedinShareButton>

      <ThreadsShareButton url={url} title={title}>
        <ThreadsIcon size={iconSize} round={iconRound} />
      </ThreadsShareButton>

      <BlueskyShareButton
        url={url}
        title={title}
        windowWidth={660}
        windowHeight={460}
      >
        <BlueskyIcon size={iconSize} round={iconRound} />
      </BlueskyShareButton>

      <EmailShareButton openShareDialogOnClick url={url}>
        <EmailIcon size={iconSize} round={iconRound} />
      </EmailShareButton>
    </div>
  );
}
