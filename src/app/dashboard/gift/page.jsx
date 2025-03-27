"use client";
import { useState, useEffect } from "react";
import BreadCrumb from "@/components/dashboard/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Check, ChevronsUpDown } from "lucide-react";
import { getShop } from "@/helpers/shop";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCsrfToken } from "next-auth/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";

const breadcrumbItems = [{ title: "Gift", link: "/dashboard/gift" }];

const sendGift = async (offerId, price, receiverId) => {
  try {
    const res = await fetch("/api/gift", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": await getCsrfToken(),
      },
      body: JSON.stringify({
        offerId,
        price,
        receiverId,
      }),
    });
    if (!res.ok) throw new Error("Failed to send gift");
    const data = await res.json();
    return data;
  } catch (error) {
    return { message: error.message || "Failed to send gift" };
  }
};

const DashboardGiftPage = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [offerId, setOfferId] = useState("");
  const [username, setUsername] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [creatorCode, setCreatorCode] = useState("");
  const [shop, setShop] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creatorLoading, setCreatorLoading] = useState(false);
  const [sentLoading, setSentLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [botsData, setBotsData] = useState([]);
  const { toast } = useToast();

  const handleSubmitGift = async (e) => {
    e.preventDefault();
    setBotsData([]);
    if (!value) {
      return toast({ title: "Skin empty", description: "Skin can't be empty" });
    }
    if (!username) {
      return toast({
        title: "User empty",
        description: "Username can't be empty",
      });
    }
    const skin = shop.find(
      (i) => i.offerId === value.split("id=")[1].split("?price")[0]
    );

    setSentLoading(true);
    const sentGift = await sendGift(
      skin.offerId,
      skin.price.finalPrice,
      username.trim()
    );
    setSentLoading(false);

    if (sentGift.message) {
      return toast({
        title: "Error",
        description:
          sentGift.message === "username-error"
            ? "Fortnite username wrong"
            : sentGift.message,
      });
    }

    if (Array.isArray(sentGift) && sentGift.length > 1) {
      setBotsData(sentGift);
      setDialogOpen(true);
    } else if (sentGift.status === 200) {
      setUsername("");
      setValue("");
      return toast({
        title: "Success",
        description: `Skin sent to ${username}`,
      });
    }
  };

  const handleSubmitCreatorCode = async (e) => {
    e.preventDefault();
    setCreatorLoading(true);
    try {
      const res = await fetch("/api/creatorcode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": await getCsrfToken(),
        },
        body: JSON.stringify({
          authorizationCode: JSON.parse(authCode).authorizationCode,
          username: creatorCode,
        }),
      });
      if (!res.ok) throw new Error("Failed to set creator code");

      const resJson = await res.json();
      if (resJson) {
        setCreatorLoading(false);
        toast({
          title: "Success",
          description: "Creator code set successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to set creator code",
      });
      setCreatorLoading(false);
    }
  };

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const shopData = await getShop();
        if (shopData.shop !== undefined) {
          setShop(shopData.shop);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch shop data",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, []);

  return (
    <main className="flex-1 pt-16 overflow-hidden">
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <BreadCrumb type="dashboard" items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{`Gift`}</h2>
            <p className="text-sm text-muted-foreground">
              Send gifts (Client side table functionalities.)
            </p>
          </div>
        </div>
        <Separator />
        <div className="rounded-md flex items-start justify-between flex-col">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Gift status</DialogTitle>
                <DialogDescription>Status of the gift</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bot</TableHead>
                      <TableHead>State</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {botsData.map((data, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {data.bot}
                        </TableCell>
                        <TableCell>
                          {data.status === 28015
                            ? "Gift limit reached"
                            : data.status === 28014
                            ? "Not friends or not for 2 days"
                            : data.status === 12720
                            ? "Insufficient V-Bucks"
                            : data.status === 10000
                            ? "Token error"
                            : data.status === 28004
                            ? "Not MFA"
                            : "Unknown"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Label htmlFor="skin">Skin</Label>
          <Popover open={open} onOpenChange={() => setOpen(!open)}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                disabled={sentLoading}
                className="flex justify-between capitalize h-auto w-full mt-2"
              >
                <div className="flex items-center w-auto">
                  {value && (
                    <Image
                      src={
                        shop.find((skin) => skin.offerId === offerId)
                          ?.displayAssets[0]?.full_background ||
                        shop.find((skin) => skin.offerId === offerId)
                          ?.displayAssets[0]?.background ||
                        shop.find((skin) => skin.offerId === offerId)
                          ?.displayAssets[0]?.url ||
                        shop.find((skin) => skin.offerId === offerId)
                          ?.granted[0]?.images?.icon ||
                        null
                      }
                      width={50}
                      height={50}
                      className="rounded-md mr-4"
                      alt=""
                    />
                  )}
                  <div className="w-auto">
                    <p className="max-sm:w-7/12 truncate">
                      {value
                        ? shop.find((skin) => skin.offerId === offerId)
                            ?.displayName
                        : "Select a skin"}
                    </p>
                    {value && (
                      <div className="flex items-center">
                        <Image
                          src="https://purepng.com/public/uploads/large/one-v-buck-dpf.png"
                          alt=""
                          width={20}
                          height={20}
                        />
                        <p className="font-[Fortnite] text-xl h-[26px] leading-7">
                          {
                            shop.find((skin) => skin.offerId === offerId)?.price
                              .finalPrice
                          }
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full max-sm:w-[400px]">
              <Command>
                <CommandInput placeholder="Search for skin" />
                <CommandEmpty>No skins found</CommandEmpty>
                <CommandGroup>
                  <CommandList>
                    {loading ? (
                      <></>
                    ) : (
                      <>
                        {shop.map(
                          (skin) =>
                            skin?.displayAssets?.length !== 0 &&
                            skin?.granted?.length !== 0 && (
                              <div
                                key={skin.offerId}
                                className="flex items-center justify-between"
                              >
                                <CommandItem
                                  className="capitalize flex items-center justify-between flex-1 mr-2"
                                  onSelect={(currentValue) => {
                                    setOfferId(
                                      currentValue
                                        .split("id=")[1]
                                        .split("?price")[0]
                                    );
                                    setValue(
                                      currentValue === value ? "" : currentValue
                                    );
                                    setOpen(false);
                                  }}
                                >
                                  <div className="flex items-center">
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        value === skin.displayName
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    <Image
                                      src={
                                        skin.displayAssets.length > 0
                                          ? skin.displayAssets[0].background ||
                                            skin.displayAssets[0].url
                                          : skin.granted.length > 0
                                          ? skin.granted[0].images.icon
                                          : null
                                      }
                                      onError={(e) =>
                                        (e.target.src =
                                          "/images/image-not-found.webp")
                                      }
                                      width={50}
                                      height={50}
                                      className="mr-4"
                                      alt=""
                                    />
                                    {skin.displayName}
                                  </div>
                                  <p className="hidden">
                                    id={skin.offerId}?price=
                                  </p>
                                  <div className="flex items-center ml-2">
                                    <Image
                                      src="https://purepng.com/public/uploads/large/one-v-buck-dpf.png"
                                      alt=""
                                      width={20}
                                      height={20}
                                    />
                                    <p className="font-[Fortnite] text-xl h-[26px] leading-7">
                                      {skin.price.finalPrice}
                                    </p>
                                  </div>
                                </CommandItem>
                              </div>
                            )
                        )}
                      </>
                    )}
                  </CommandList>
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>

          <form onSubmit={handleSubmitGift} className="flex-1 mt-2 w-full">
            <Label htmlFor="username">Username</Label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={sentLoading}
              id="username"
              placeholder="berlin"
              className="mt-2"
            />
            <Button
              type="submit"
              className="mt-3 w-full"
              disabled={sentLoading}
              variant="secondary"
            >
              {sentLoading ? (
                <svg
                  className={`animate-spin mr-1 h-5 w-5 text-white`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Send"
              )}
            </Button>
          </form>
        </div>
        <Separator />
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{`Creator code`}</h2>
            <p className="text-sm text-muted-foreground">
              Set Creator Code (Client side table functionalities.)
            </p>
          </div>
        </div>
        <Separator />
        <div className="rounded-md flex items-start justify-between flex-col">
          <div className="w-full">
            <Label htmlFor="token">Token</Label>
            <div className="flex items-center mt-2">
              <Input
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
                disabled={creatorLoading}
                className="w-full"
                placeholder="Authorization Code"
                id="authCode"
              />
              <Link
                target="_blank"
                className="h-10 ml-2 w-[150px] rounded-md flex items-center justify-center text-sm hover:bg-[#1A1A1A] transition-all bg-[#2A2A2A]"
                href="https://www.epicgames.com/id/api/redirect?clientId=3446cd72694c4a4485d81b77adbb2141&responseType=code"
              >
                View code
              </Link>
            </div>
          </div>

          <form
            onSubmit={handleSubmitCreatorCode}
            className="flex-1 mt-2 w-full"
          >
            <Label htmlFor="creatorCode">Creator code</Label>
            <Input
              value={creatorCode}
              onChange={(e) => setCreatorCode(e.target.value)}
              disabled={creatorLoading}
              id="username"
              className="mt-2"
              placeholder="berlin"
            />
            <Button
              type="submit"
              className="mt-3 w-full"
              disabled={creatorLoading}
              variant="secondary"
            >
              {creatorLoading ? (
                <svg
                  className={`animate-spin mr-1 h-5 w-5 text-white`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Set creator code"
              )}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default DashboardGiftPage;
