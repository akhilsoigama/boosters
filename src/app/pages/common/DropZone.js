'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import { Typography, Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const ImageDropZone = ({
    value,
    onChange,
    placeholderText = "Drag & drop an image here, or click to select one",
    maxSize = 5 * 1024 * 1024,
}) => {
    const [image, setImage] = useState(null);

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };

    const compressImage = async (file) => {
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
        };
        return await imageCompression(file, options);
    };

    const onDrop = async (acceptedFiles, fileRejections) => {
        if (fileRejections.length) {
            alert("File rejected. Please upload a valid image within size limits.");
            return;
        }

        const file = acceptedFiles[0];
        if (file) {
            try {
                const compressedFile = await compressImage(file);
                const preview = URL.createObjectURL(compressedFile);
                const base64 = await convertToBase64(compressedFile);
                setImage({ file: compressedFile, preview });
                onChange(base64);
            } catch (error) {
                console.error("Error processing file:", error);
            }
        }
    };

    const dropzoneProps = useMemo(() => ({
        accept: {
            'image/jpeg': ['.jpeg', '.jpg'],
            'image/png': ['.png'],
            'image/gif': ['.gif'],
            'image/webp': ['.webp'],
        },
        maxSize,
        maxFiles: 1,
        onDrop,
    }), [maxSize]);

    const { getRootProps, getInputProps } = useDropzone(dropzoneProps);

    useEffect(() => {
        if (!value) {
            setImage(null);
        }
    }, [value]);

    useEffect(() => {
        return () => {
            if (image?.preview) {
                URL.revokeObjectURL(image.preview);
            }
        };
    }, [image]);

    const renderPreview = useMemo(() => {
        if (image) {
            return (
                <Box className="w-full text-center">
                    <Box className="relative">
                        <img
                            src={image.preview}
                            alt="Preview"
                            className="w-full h-auto md:h-96 object-cover rounded-lg mx-auto"
                        />
                        <IconButton
                            onClick={(e) => {
                                e.stopPropagation();
                                onChange(null);
                            }}
                            className="absolute top-2 right-2 bg-white hover:bg-gray-100"
                            size="small"
                        >
                            <DeleteIcon className="text-red-500" />
                        </IconButton>
                    </Box>
                </Box>
            );
        }

        return (
            <Box>
                <img
                    src="https://i.pinimg.com/originals/56/74/51/5674515621e872310e356243db78b14f.gif"
                    alt="Upload Placeholder"
                    className="w-full h-32 object-contain"
                />
                <Typography variant="body1" className="mt-2 text-gray-500">
                    {placeholderText}
                </Typography>
            </Box>
        );
    }, [image, onChange, placeholderText]);

    return (
        <Box>
            <Box
                {...getRootProps()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors duration-300"
            >
                <input {...getInputProps()} />
                {renderPreview}
            </Box>
        </Box>
    );
};

export default ImageDropZone;
