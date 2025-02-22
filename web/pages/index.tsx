"use client";
import axios from "axios";
import React, { useState } from "react";
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
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from "@mui/icons-material/Home";

import Image from "@/types/image";

export default function Home() {
    const [searchText, setSearchText] = useState<string>("");
    const [imageList, setImageList] = useState<Image[]>([]);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [selectedImage, setSelectedImage] = useState<Image | null>(null);
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const response = await axios.get("/memes/api/search", {
            params: {
                text: searchText,
            },
        });
        setImageList(response.data);
    };

    const handleImageClick = (image: Image) => {
        setSelectedImage(image);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleHomeClick = () => {
        setImageList([]);
        setSearchText("");
        router.push("/");
    };

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
                {imageList.map((image: Image, index: number) => (
                    <ImageListItem key={index}>
                        <img
                            key={index}
                            src={`${image.img}?&fit=cover`}
                            alt={image.title}
                            style={{ cursor: "pointer" }}
                            onClick={() => handleImageClick(image)}
                        />
                    </ImageListItem>
                ))}
            </ImageList>
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
