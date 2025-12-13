import { ChartContainer } from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert, CheckCircle } from "lucide-react";
import { BarChart, Bar, XAxis } from "recharts";

console.log("Hidden and commmented out. This is used to pentest the system.");


/*
export default function SecurityTest() {
    // Malicious configuration payload
    // If the fix is NOT working, this closing style tag will break out of the style block
    // and the img tag will execute the alert.
    // Note: We use a console.log instead of alert to be less annoying, but alert works too.
    const maliciousConfig = {
        test: {
            label: "Test Attack",
            color: "</style><img src=x onerror=\"alert('XSS SUCCESSFUL! Vulnerability exists.')\">",
        },
        safe: {
            label: "Safe Color",
            color: "hsl(var(--primary))",
        }
    };

    const data = [
        { name: "A", value: 100 },
        { name: "B", value: 200 },
    ];

    return (
        <div className="container mx-auto p-8 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>XSS Vulnerability Test</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Alert>
                        <ShieldAlert className="h-4 w-4" />
                        <AlertTitle>Test Description</AlertTitle>
                        <AlertDescription>
                            This page attempts to inject a malicious payload through the Chart component's config.
                            <br />
                            <strong>Payload:</strong> <code>{`</style><img src=x onerror="alert('XSS SUCCESSFUL!')">`}</code>
                        </AlertDescription>
                    </Alert>

                    <div className="border p-4 rounded-lg bg-gray-50">
                        <h3 className="font-semibold mb-4">Chart Render Area:</h3>
                        {/* @ts-ignore - Demonstrating attack with invalid type *//*}
<ChartContainer config={maliciousConfig} className="min-h-[200px] w-full">
    <BarChart data={data}>
        <Bar dataKey="value" fill="var(--color-safe)" />
        <XAxis dataKey="name" />
    </BarChart>
</ChartContainer>
</div>

<Alert variant="default" className="border-green-200 bg-green-50">
<CheckCircle className="h-4 w-4 text-green-600" />
<AlertTitle>Expected Result (If Fixed)</AlertTitle>
<AlertDescription className="text-green-800">
    You should <strong>NOT</strong> see an alert popup.
    <br />
    The malicious style rule should be stripped, and the chart might render partially or without the color, but no code should execute.
</AlertDescription>
</Alert>
</CardContent>
</Card>
</div>
);
}*/