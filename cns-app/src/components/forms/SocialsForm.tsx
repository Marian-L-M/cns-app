import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Plus } from "lucide-react";

export const SOCIAL_PLATFORMS: { value: string; label: string }[] = [
  { value: "website", label: "Website" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "tiktok", label: "TikTok" },
  { value: "deviantart", label: "DeviantArt" },
  { value: "discord", label: "Discord" },
  { value: "reddit", label: "Reddit" },
  { value: "youtube", label: "YouTube" },
  { value: "twitter", label: "X (Twitter)" },
  { value: "github", label: "Github" },
  { value: "other", label: "Other" },
];

interface SocialMediaSectionProps {
  socialIcons?: Social[];
}

export default function SocialsForm({
  socialIcons = [],
}: SocialMediaSectionProps) {
  const { setValue } = useFormContext();

  const defaultValues = socialIcons.map((social) => ({
    platform: social.platform || "website",
    url: social.url || "",
    label: social.label || "",
  }));

  const [socials, setSocials] = useState<Social[]>(defaultValues);

  const addSocial = () => {
    const newSocials = [
      ...socials,
      { platform: "website", url: "", label: "" },
    ];
    setSocials(newSocials);
    setValue("socials", newSocials);
  };

  const removeSocial = (index: number) => {
    const newSocials = socials.filter((_, i) => i !== index);
    setSocials(newSocials);
    setValue("socials", newSocials);
  };

  const updateSocial = (index: number, field: keyof Social, value: string) => {
    const newSocials = [...socials];
    newSocials[index] = { ...newSocials[index], [field]: value };
    setSocials(newSocials);
    setValue("socials", newSocials);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Socials
          <Button type="button" variant="outline" size="sm" onClick={addSocial}>
            <Plus className="w-4 h-4 mr-2" />
            Add Social
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {socials.map((social, index) => (
          <div key={index} className="flex gap-2 items-center">
            <Select
              value={social.platform}
              onValueChange={(value) => updateSocial(index, "platform", value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SOCIAL_PLATFORMS.map((platform) => (
                  <SelectItem key={platform.value} value={platform.value}>
                    {platform.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              value={social.label}
              onChange={(e) => updateSocial(index, "label", e.target.value)}
              placeholder="Label"
              className="flex-1"
            />
            <Input
              value={social.url}
              onChange={(e) => updateSocial(index, "url", e.target.value)}
              placeholder="Url"
              className="flex-[2]"
            />

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeSocial(index)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}

        {socials.length === 0 && (
          <p className="text-muted-foreground text-sm">No media links.</p>
        )}
      </CardContent>
    </Card>
  );
}
