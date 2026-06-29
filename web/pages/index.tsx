"use client";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

import {
    Box,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    ImageList,
    ImageListItem,
    InputAdornment,
    CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from "@mui/icons-material/Home";

import Image from "@/types/image";

interface SearchResponse {
    items: Image[];
    hasMore: boolean;
}

export default function Home() {
    const [searchText, setSearchText] = useState<string>("");
    const [imageList, setImageList] = useState<Image[]>([]);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [selectedImage, setSelectedImage] = useState<Image | null>(null);
    const [activeQuery, setActiveQuery] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const searchStateRef = useRef({
        activeQuery: null as string | null,
        hasMore: false,
        imageCount: 0,
        isLoading: false,
    });
    const router = useRouter();

    useEffect(() => {
        searchStateRef.current = {
            activeQuery,
            hasMore,
            imageCount: imageList.length,
            isLoading,
        };
    }, [activeQuery, hasMore, imageList.length, isLoading]);

    const fetchImages = async (query: string, offset = 0, reset = false) => {
        const trimmedQuery = query.trim();

        if (!reset && searchStateRef.current.isLoading) {
            return;
        }

        if (reset) {
            abortControllerRef.current?.abort();
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;
        searchStateRef.current.isLoading = true;
        setIsLoading(true);

        try {
            const response = await axios.get<SearchResponse>("/memes/api/search", {
                params: {
                    text: trimmedQuery,
                    offset,
                },
                signal: controller.signal,
            });

            setImageList((currentImages) =>
                reset
                    ? response.data.items
                    : [...currentImages, ...response.data.items]
            );
            setActiveQuery(trimmedQuery);
            setHasMore(response.data.hasMore);
        } catch (error) {
            if (!axios.isCancel(error)) {
                throw error;
            }
        } finally {
            if (abortControllerRef.current === controller) {
                abortControllerRef.current = null;
            }

            searchStateRef.current.isLoading = false;
            setIsLoading(false);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        await fetchImages(searchText, 0, true);
    };

    const handleImageClick = (image: Image) => {
        setSelectedImage(image);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleHomeClick = () => {
        abortControllerRef.current?.abort();
        setImageList([]);
        setSearchText("");
        setActiveQuery(null);
        setHasMore(false);
        setIsLoading(false);
        searchStateRef.current = {
            activeQuery: null,
            hasMore: false,
            imageCount: 0,
            isLoading: false,
        };
        router.push("/");
    };

    useEffect(() => {
        if (!loadMoreRef.current) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (!entries[0]?.isIntersecting) {
                    return;
                }

                const {
                    activeQuery: currentQuery,
                    hasMore: canLoadMore,
                    imageCount,
                    isLoading: loading,
                } = searchStateRef.current;

                if (currentQuery === null || !canLoadMore || loading || imageCount <= 0) {
                    return;
                }

                void fetchImages(currentQuery, imageCount);
            },
            {
                rootMargin: "200px 0px",
            }
        );

        observer.observe(loadMoreRef.current);

        return () => {
            observer.disconnect();
        };
    }, []);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    return imageList.length <= 0 ? (
        <Box
            sx={{
                backgroundImage: "url('memes/background-75.png')",
                backgroundSize: "cover",
            }}
        >
            <Grid
                container
                spacing={3}
                direction="column"
                alignItems="center"
                justifyContent="center"
                sx={{
                    minHeight: "100vh",
                    minWidth: "100%",
                }}
            >
                <Grid size={12} sx={{ width: "50%" }}>
                    <form
                        noValidate
                        autoComplete="off"
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                        onSubmit={(e) => handleSubmit(e)}
                    >
                        <TextField
                            fullWidth
                            id="outlined-basic"
                            variant="outlined"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "30px",
                                },
                                backgroundColor: "white",
                                borderRadius: "30px",
                                boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.75)",
                            }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            style={{ marginTop: "20px", width: "30%" }}
                        >
                            Search
                        </Button>
                    </form>
                </Grid>
            </Grid>
        </Box>
    ) : (
        <Box
            sx={{
                backgroundImage: "url('memes/background-40.png')",
                backgroundSize: "cover",
                paddingTop: "8px",
            }}
        >
            <Grid
                container
                spacing={3}
                direction="column"
                alignItems="center"
                justifyContent="flex-start"
                sx={{ minWidth: "100%" }}
            >
                <Grid size={12} sx={{ width: "35%" }}>
                    <form
                        noValidate
                        autoComplete="off"
                        onSubmit={(e) => handleSubmit(e)}
                    >
                        <TextField
                            fullWidth
                            id="outlined-basic"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            variant="outlined"
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <IconButton
                                                onClick={handleHomeClick}
                                            >
                                                <HomeIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton type="submit">
                                                <SearchIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "30px",
                                },
                            }}
                        />
                    </form>
                </Grid>
            </Grid>
            <ImageList
                cols={6}
                gap={16}
                sx={{ width: "100%", paddingBottom: "8px" }}
            >
                {imageList.map((image: Image) => (
                    <ImageListItem key={image.img}>
                        <img
                            src={`${image.img}?&fit=cover`}
                            alt={image.title}
                            loading="lazy"
                            decoding="async"
                            style={{ cursor: "pointer", width: "100%", height: "auto" }}
                            onClick={() => handleImageClick(image)}
                        />
                    </ImageListItem>
                ))}
            </ImageList>
            <Box
                ref={loadMoreRef}
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    paddingBottom: "24px",
                }}
            >
                {isLoading ? <CircularProgress /> : null}
            </Box>
            <Dialog
                open={dialogOpen}
                onClose={handleDialogClose}
                disableScrollLock
            >
                <DialogTitle>{selectedImage?.title}</DialogTitle>
                <DialogContent>
                    <img
                        src={selectedImage?.img}
                        alt={selectedImage?.title}
                        decoding="async"
                        style={{ width: "100%" }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
