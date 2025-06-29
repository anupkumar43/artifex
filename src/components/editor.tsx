"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Dropzone from "./dropzone";
import Style from "./style";
import { removeBackground } from "@imgly/background-removal";
import { Button } from "./ui/button";
import { IoMdArrowBack } from "react-icons/io";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { inter, domine } from "../app/fonts";
import { getPresignedUrl } from "~/app/actions/aws";
import { generate, refresh } from "~/app/actions/generate";

const colorOptions = [
  { label: "Black", value: "black" },
  { label: "White", value: "white" },
  { label: "Red", value: "red" },
  { label: "Maroon", value: "maroon" },
  { label: "Green", value: "green" },
  { label: "Yellow", value: "yellow" },
  { label: "Blue", value: "blue" },
];

const bgColorOptions = [
  { label: "White", value: "#ffffff" },
  { label: "Black", value: "#000000" },
  { label: "Red", value: "#ff0000" },
  { label: "Green", value: "#00ff00" },
  { label: "Blue", value: "#0000ff" },
  { label: "Yellow", value: "#ffff00" },
  { label: "Orange", value: "#ffa500" },
  { label: "Purple", value: "#800080" },
];

const Editor = ({ children }: { children: React.ReactNode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fgImage, setFgImage] = useState<string | null>(null);
  const [removeBgDone, setRemoveBgDone] = useState(false);
  const [removing, setRemoving] = useState(false);

  const [text, setText] = useState("POV");
  const [font, setFont] = useState("arial");
  const [textColor, setTextColor] = useState("white");
  const [filter, setFilter] = useState("none");
  const [solidBg, setSolidBg] = useState("");
  const [customBg, setCustomBg] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState("style1");

  const drawText = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const selectedFont =
        font === "inter"
          ? inter.style.fontFamily
          : font === "domine"
            ? domine.style.fontFamily
            : "arial";
      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      let fontSize = 100;
      ctx.font = `bold ${fontSize}px ${selectedFont}`;
      const textWidth = ctx.measureText(text).width;
      const scale = (ctx.canvas.width * 0.9) / textWidth;
      fontSize *= scale;
      ctx.font = `bold ${fontSize}px ${selectedFont}`;
      ctx.fillStyle = textColor;
      ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
      ctx.fillText(text, 0, 0);
      ctx.restore();
    },
    [text, font, textColor],
  );

  const drawFg = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      if (!fgImage) return;
      const fg = new Image();
      fg.onload = () => {
        ctx.drawImage(fg, 0, 0, ctx.canvas.width, ctx.canvas.height);
      };
      fg.src = fgImage;
    },
    [fgImage],
  );

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageSrc) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const baseImg = new Image();
    baseImg.onload = () => {
      canvas.width = baseImg.width;
      canvas.height = baseImg.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.filter = filter;

      if (removeBgDone) {
        if (customBg) {
          const bgImg = new Image();
          bgImg.onload = () => {
            ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
            drawText(ctx);
            drawFg(ctx);
          };
          bgImg.src = customBg;
        } else {
          ctx.fillStyle = solidBg;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          drawText(ctx);
          drawFg(ctx);
        }
      } else {
        ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);
        drawText(ctx);
      }
    };
    baseImg.src = imageSrc;
  }, [imageSrc, filter, removeBgDone, customBg, solidBg, drawText, drawFg]);

  const setSelectedImage = async (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const src = e.target?.result as string;
      setImageSrc(src);
      setRemoveBgDone(false);
      setFgImage(null);
      await generate();
    };
    reader.readAsDataURL(file);
  };

  const handleCustomBg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCustomBg(reader.result as string);
      setSolidBg("");
    };
    reader.readAsDataURL(file);
  };

  const removeBg = async () => {
    if (!imageSrc) return;
    setRemoving(true);
    const blob = await removeBackground(imageSrc);
    const url = URL.createObjectURL(blob);
    setFgImage(url);
    setRemoveBgDone(true);
    setRemoving(false);
  };

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const uploadToS3 = async (blob: Blob) => {
    const uploadUrl = await getPresignedUrl();
    await fetch(uploadUrl, {
      method: "PUT",
      body: blob,
      headers: { "Content-Type": "image/png" },
    });
    await refresh();
  };

  const handleDownload = async () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;

    // Download locally
    const link = document.createElement("a");
    link.download = "image.png";
    link.href = canvas.toDataURL();
    link.click();

    // Upload to S3
    canvas.toBlob((blob) => {
      if (!blob) return;
      void uploadToS3(blob);
    }, "image/png");
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center px-4 pt-10 pb-10">
      {imageSrc ? (
        <>
          <div className="mb-4 w-full max-w-2xl">
            <button
              onClick={() => {
                setImageSrc(null);
                setFgImage(null);
                setRemoveBgDone(false);
                setSolidBg("");
                setCustomBg(null);
              }}
              className="text-muted-foreground hover:text-foreground mb-4 flex items-center gap-2 text-sm"
            >
              <IoMdArrowBack />
              <span>Go back</span>
            </button>
            <canvas
              ref={canvasRef}
              className="bg-muted max-h-[80vh] w-full rounded-lg object-contain"
            />
          </div>

          {!removeBgDone && (
            <Button className="mb-6" onClick={removeBg} disabled={removing}>
              {removing ? "Removing..." : "Remove Background"}
            </Button>
          )}

          <Card className="w-full max-w-2xl border shadow-md">
            <CardHeader>
              <CardTitle>Edit Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Text Settings */}
              <div className="space-y-4">
                <h3 className="text-muted-foreground text-lg font-semibold">
                  Text Settings
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Overlay Text */}
                  <div className="flex flex-col gap-1">
                    <Label>Overlay Text</Label>
                    <Input
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Enter caption..."
                    />
                  </div>

                  {/* Color and Font */}
                  <div className="flex items-end gap-4">
                    {/* Color */}
                    <div className="flex w-full flex-col gap-1">
                      <Label>Color</Label>
                      <Select value={textColor} onValueChange={setTextColor}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choose color" />
                        </SelectTrigger>
                        <SelectContent>
                          {colorOptions.map((c) => (
                            <SelectItem key={c.value} value={c.value}>
                              {c.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Font */}
                    <div className="flex w-full flex-col gap-1">
                      <Label>Font</Label>
                      <Select value={font} onValueChange={setFont}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choose font" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="arial">Arial</SelectItem>
                          <SelectItem value="inter">Inter</SelectItem>
                          <SelectItem value="domine">Domine</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filter */}
              <div className="space-y-2">
                <Label>Filter</Label>
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="grayscale(100%)">Grayscale</SelectItem>
                    <SelectItem value="sepia(100%)">Sepia</SelectItem>
                    <SelectItem value="brightness(1.2)">Bright</SelectItem>
                    <SelectItem value="contrast(1.5)">Contrast</SelectItem>
                    <SelectItem value="blur(2px)">Blur</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Background Settings */}
              {removeBgDone && (
                <div className="space-y-4">
                  <h3 className="text-muted-foreground text-lg font-semibold">
                    Background Settings
                  </h3>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleCustomBg}
                  />
                  <Select
                    value={solidBg}
                    onValueChange={(val) => {
                      setSolidBg(val);
                      setCustomBg(null);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Solid color" />
                    </SelectTrigger>
                    <SelectContent>
                      {bgColorOptions.map((bg) => (
                        <SelectItem key={bg.value} value={bg.value}>
                          {bg.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="color"
                    value={solidBg}
                    onChange={(e) => {
                      setSolidBg(e.target.value);
                      setCustomBg(null);
                    }}
                    className="h-10 w-full"
                  />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleDownload}>Download</Button>
            </CardFooter>
          </Card>
        </>
      ) : (
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Hi there 👋
          </h1>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Want to edit your Picture?
          </h1>
          <p className="text-muted-foreground mt-2 leading-7">
            Here’s what you can create with Artifex 👇
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-10">
            <div className="flex flex-col items-center gap-6 md:flex-row">
              <Style
                image="/style1.png"
                selectStyle={() => setSelectedStyle("style1")}
                isSelected={selectedStyle === "style1"}
              />
              <Style
                image="/style2.png"
                selectStyle={() => setSelectedStyle("style2")}
                isSelected={selectedStyle === "style2"}
              />
              <Style
                image="/style3.png"
                selectStyle={() => setSelectedStyle("style3")}
                isSelected={selectedStyle === "style3"}
              />
            </div>
            <Dropzone setSelectedImage={setSelectedImage} />
          </div>
          <div className="mt-8">{children}</div>
        </div>
      )}
    </div>
  );
};

export default Editor;
