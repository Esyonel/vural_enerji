
export interface SolarPackage {
    id: string;
    name: string;
    description: string;
    minBill: number;
    maxBill: number;
    systemPower: string;
    totalPrice: number;
    installationCost?: number;
    imageUrl?: string;
    savings?: string;
    paybackPeriod?: string;
    status: 'active' | 'inactive';
    createdDate: string;
    products?: PackageProduct[];
}

export interface PackageProduct {
    id?: string;
    packageId?: string;
    productId: string;
    productName?: string;
    quantity: number;
    unitPrice?: number;
    imageUrl?: string;
}
