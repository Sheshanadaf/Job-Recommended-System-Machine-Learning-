import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface FormField {
  id: string;
  label: string;
  value: string;
  isCustom: boolean;
}

const QualificationsFormPage: React.FC = () => {
  const navigate = useNavigate();
  const [fields, setFields] = useState<FormField[]>([
    { id: "fullName", label: "Full Name", value: "", isCustom: false },
    { id: "dateOfBirth", label: "Date of Birth", value: "", isCustom: false },
    { id: "headline", label: "Headline", value: "", isCustom: false },
    { id: "email", label: "Email", value: "", isCustom: false },
    { id: "website", label: "Website", value: "", isCustom: false },
    { id: "phone", label: "Phone", value: "", isCustom: false },
    { id: "location", label: "Location", value: "", isCustom: false },
    { id: "profiles", label: "Profiles", value: "", isCustom: false },
    { id: "experience", label: "Experience", value: "", isCustom: false },
    { id: "education", label: "Education", value: "", isCustom: false },
    { id: "skills", label: "Skills", value: "", isCustom: false },
    { id: "languages", label: "Languages", value: "", isCustom: false },
    { id: "awards", label: "Awards", value: "", isCustom: false },
    {
      id: "certifications",
      label: "Certifications",
      value: "",
      isCustom: false,
    },
    { id: "interests", label: "Interests", value: "", isCustom: false },
    { id: "projects", label: "Projects", value: "", isCustom: false },
    { id: "publications", label: "Publications", value: "", isCustom: false },
    { id: "volunteering", label: "Volunteering", value: "", isCustom: false },
    { id: "references", label: "References", value: "", isCustom: false },
    { id: "summary", label: "Summary", value: "", isCustom: false },
  ]);

  const [newFieldLabel, setNewFieldLabel] = useState("");

  const handleFieldChange = (id: string, value: string) => {
    setFields(
      fields.map((field) => (field.id === id ? { ...field, value } : field))
    );
  };

  const addNewField = () => {
    if (!newFieldLabel.trim()) {
      toast({
        title: "Field name required",
        description: "Please enter a name for the new field.",
        variant: "destructive",
      });
      return;
    }

    const newField: FormField = {
      id: `custom_${Date.now()}`,
      label: newFieldLabel,
      value: "",
      isCustom: true,
    };

    setFields([...fields, newField]);
    setNewFieldLabel("");
    toast({
      title: "Field added",
      description: `${newFieldLabel} field has been added successfully.`,
    });
  };

  const removeField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id));
    toast({
      title: "Field removed",
      description: "The field has been removed from the form.",
    });
  };

  const handleSubmit = async () => {
    const filledFields = fields.filter((field) => field.value.trim() !== "");

    if (filledFields.length === 0) {
      toast({
        title: "No information provided",
        description: "Please fill at least one field before submitting.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(
        "https://8631a6e8-07a3-4731-abdc-7a644862e9a5.mock.pstmn.io/api/submit-qualifications",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            qualifications: filledFields,
          }),
        }
      );

      if (!response.ok) throw new Error("Submission failed");

      const data = await response.json();

      toast({
        title: "Submitted Successfully",
        description: data.message,
      });

    
      navigate(data.matchingRoute);
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was a problem submitting your profile.",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const handleBack = () => {
    navigate("/qualifications");
  };

  const isMultiline = (fieldId: string) => {
    return [
      "experience",
      "education",
      "summary",
      "projects",
      "publications",
      "volunteering",
    ].includes(fieldId);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto h-full">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Professional Profile Form
            </h1>
            <p className="text-muted-foreground">
              Fill in your professional details to create your profile
            </p>
          </div>

          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
            </CardHeader>
            <CardContent className="h-full flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-6 pr-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {fields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={field.id}>{field.label}</Label>
                        {field.isCustom && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeField(field.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      {isMultiline(field.id) ? (
                        <Textarea
                          id={field.id}
                          value={field.value}
                          onChange={(e) =>
                            handleFieldChange(field.id, e.target.value)
                          }
                          placeholder={`Enter your ${field.label.toLowerCase()}`}
                          rows={3}
                        />
                      ) : (
                        <Input
                          id={field.id}
                          type={
                            field.id === "email"
                              ? "email"
                              : field.id === "dateOfBirth"
                              ? "date"
                              : "text"
                          }
                          value={field.value}
                          onChange={(e) =>
                            handleFieldChange(field.id, e.target.value)
                          }
                          placeholder={`Enter your ${field.label.toLowerCase()}`}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Add New Field Section */}
                <div className="border-t pt-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Add Custom Field
                  </h3>
                  <div className="flex gap-4">
                    <Input
                      placeholder="Enter field name"
                      value={newFieldLabel}
                      onChange={(e) => setNewFieldLabel(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addNewField()}
                    />
                    <Button onClick={addNewField}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Field
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-6">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <Button onClick={handleSubmit} size="lg">
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualificationsFormPage;