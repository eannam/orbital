import ParsedItemCard from "@/components/parsed-item-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getParsedData, getRawData } from "@/lib/queries";
import { parsedDataAtom } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { SearchIcon } from "lucide-react";
import { Geist, Geist_Mono } from "next/font/google";
import { useEffect, useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const setParsedData = useSetAtom(parsedDataAtom);

  const {
    data: rawData,
    isLoading: getRawDataIsLoading,
    isError: getRawDataIsError,
  } = useQuery({
    queryKey: ["rawData"],
    queryFn: getRawData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const {
    data: parsedData,
    isLoading: getParsedDataIsLoading,
    isError: getParsedDataIsError,
  } = useQuery({
    queryKey: ["parsedData"],
    queryFn: getParsedData,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (parsedData) {
      setParsedData(parsedData);
    }
  }, [parsedData, setParsedData]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const handleSearchClick = () => {
    setSearch(searchInput);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setSearch(searchInput);
    }
  };

  const filteredData =
    parsedData?.filter((entry) => {
      if (!search) return true;
      const searchLower = search.toLowerCase();

      return (
        entry.description.toLowerCase().includes(searchLower) ||
        entry.notes.some((note) => note.toLowerCase().includes(searchLower))
      );
    }) || [];

  return (
    <div
      className={`${geistSans.className} ${geistMono.className} items-center justify-items-center font-[family-name:var(--font-geist-sans)] bg-neutral-200 w-full`}
    >
      <Tabs defaultValue="raw" className="justify-start">
        <TabsList>
          <TabsTrigger value="raw" className="text-neutral-300">
            Raw Data
          </TabsTrigger>
          <TabsTrigger value="parsed" className="text-neutral-300">
            Parsed Data
          </TabsTrigger>
        </TabsList>
        <TabsContent value="raw">
          <div className="w-[600px] mt-4 bg-neutral-800 rounded-sm text-xs p-4">
            <pre className="text-neutral-50 whitespace-pre-wrap">
              {getRawDataIsLoading
                ? "Loading..."
                : getRawDataIsError
                ? "Something went wrong :/"
                : JSON.stringify(rawData, null, 2)}
            </pre>
          </div>
        </TabsContent>
        <TabsContent value="parsed">
          <div className="flex flex-col items-center justify-center w-[600px] mt-4">
            <div className="flex w-full mb-4 gap-2">
              <Input
                placeholder="Search..."
                className="bg-neutral-50 text-neutral-800"
                value={searchInput}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
              />
              <Button
                variant="secondary"
                className="cursor-pointer"
                onClick={handleSearchClick}
              >
                <SearchIcon className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-col items-center min-h-screen p-4 gap-4">
              {getParsedDataIsLoading
                ? "Loading..."
                : getParsedDataIsError
                ? "Something went wrong :/"
                : filteredData.map((entry) => (
                    <ParsedItemCard key={entry.id} {...entry} />
                  ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
