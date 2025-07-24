import React from "react";
import { X } from "lucide-react";

interface ImageUploadPreviewProps {
	images: File[];
	onRemove: (index: number) => void;
	onAdd: (files: FileList) => void;
}

const ImageUploadPreview: React.FC<ImageUploadPreviewProps> = ({
	images,
	onRemove,
	onAdd,
}) => {
	return (
		<div className="space-y-4">
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{images.map((image, index) => (
					<div key={index} className="relative group">
						<img
							src={URL.createObjectURL(image)}
							alt={`Preview ${index + 1}`}
							className="w-full h-32 object-cover rounded-lg"
						/>
						<button
							type="button"
							onClick={() => onRemove(index)}
							className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
						>
							<X className="w-4 h-4" />
						</button>
					</div>
				))}
			</div>
			<input
				type="file"
				multiple
				accept="image/*"
				onChange={(e) => e.target.files && onAdd(e.target.files)}
				className="w-full bg-[#24271b] text-white rounded-lg p-2"
			/>
		</div>
	);
};

export default ImageUploadPreview;
