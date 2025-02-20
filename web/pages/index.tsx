"use client";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { IconButton, InputAdornment } from "@mui/material";

import { Container, TextField, Button } from "@mui/material";

import Grid from "@mui/material/Grid2";
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from "@mui/icons-material/Home";
import axios from "axios";

interface Image {
    img: string;
    title: string;
}

export default function Home() {
    const [searchText, setSearchText] = useState<string>("");
    const [imageList, setImageList] = useState<Image[]>([]);
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const img: Image = {
            img: "https://sircle.id.vn/memes/images/2f5a4ba3187fc1562000b9ef67987eaf.png?&fit=cover",
            title: "test"
        };
        setImageList((prevImageList: Image[]) => [...prevImageList, img]);
        const response = await axios.get("/memes/api/search", {
            params: {
                text: searchText
            }
        });
        console.log(response.data);
    };

    const handleHomeClick = () => {
        setImageList([]);
        setSearchText("");
        router.push("/");
    }

    return (
        <Container>
            {imageList.length <= 0 ? (
                <Grid
                    container
                    spacing={3}
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    style={{ minHeight: "100vh", minWidth: "100%" }}
                >
                    <Grid size={12} sx={{ width: "50%" }}>
                        <form noValidate autoComplete="off" style={{ display: "flex", flexDirection: "column", alignItems: "center" }} onSubmit={(e) => handleSubmit(e)}>
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
                                        )
                                    }
                                }}
                                sx={{ 
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "30px",
                                    }
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
            ) : (
                <Grid
                    container
                    spacing={3}
                    direction="column"
                    alignItems="center"
                    justifyContent="flex-start"
                    style={{ minHeight: "100vh", minWidth: "100%" }}
                >
                    <Grid size={12} sx={{ width: "50%" }}>
                        <form noValidate autoComplete="off" onSubmit={(e) => handleSubmit(e)}>
                            <TextField
                                fullWidth
                                id="outlined-basic"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                variant="outlined"
                                slotProps={{
                                    input:{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <IconButton onClick={handleHomeClick}>
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
                                        )
                                    }
                                }}
                                sx={{ 
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "30px",
                                    }
                                 }}
                            />
                        </form>
                    </Grid>
                </Grid>
            )}
        </Container>
    );
}
