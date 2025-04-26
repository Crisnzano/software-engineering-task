"use client"

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  FileText,
  Filter,
  MoreHorizontal,
  Search,
  UserCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { useState, useEffect, Key, JSXElementConstructor, ReactElement, ReactNode, ReactPortal } from "react";


  export default function ClientRegistry() {
    const [clients, setClients] = useState<any[]>([]); // 👈 You forgot this line!
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [programFilter, setProgramFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedClient, setSelectedClient] = useState<any>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const itemsPerPage = 5;



    useEffect(() => {
        const fetchClients = async () => {
          try {
            const response = await fetch("/api/clients");
            const data = await response.json();
            setClients(data); // now this works!
          } catch (error) {
            console.error("Failed to fetch clients:", error);
          }
        };
    
        fetchClients();
      }, []);
    

  // Filter clients based on search query and filters
  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      searchQuery === "" ||
      client.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.contactNumber.includes(searchQuery) ||
      client.address.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || client.status === statusFilter;

    const matchesProgram =
      programFilter === "all" ||
      client.enrolledPrograms.some(
        (program: { diseaseType: string; }) => program.diseaseType === programFilter
      );

    return matchesSearch && matchesStatus && matchesProgram;
  });

  // Pagination
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClients = filteredClients.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewDetails = (client: (typeof clients)[0]) => {
    setSelectedClient(client);
    setIsDetailsOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "inactive":
        return (
          <Badge variant="outline" className="text-muted-foreground">
            Inactive
          </Badge>
        );
      case "pending":
        return <Badge className="bg-amber-500">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getProgramBadge = (diseaseType: string) => {
    switch (diseaseType) {
      case "tb":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300"
          >
            TB
          </Badge>
        );
      case "malaria":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300"
          >
            Malaria
          </Badge>
        );
      case "hiv":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300"
          >
            HIV
          </Badge>
        );
      default:
        return <Badge variant="outline">Other</Badge>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-green-50 dark:bg-green-900/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-bold text-green-800 dark:text-green-300">
              Client Registry
            </CardTitle>
            <CardDescription>
              Manage and search for registered clients
            </CardDescription>
          </div>
          <Button className="bg-green-600 hover:bg-green-700 sm:self-end">
            <UserCircle className="mr-2 h-4 w-4" /> New Client
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clients..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Status</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={programFilter} onValueChange={setProgramFilter}>
              <SelectTrigger className="w-[130px]">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Program</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Programs</SelectItem>
                <SelectItem value="tb">TB</SelectItem>
                <SelectItem value="malaria">Malaria</SelectItem>
                <SelectItem value="hiv">HIV</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead className="hidden md:table-cell">Contact</TableHead>
                <TableHead className="hidden lg:table-cell">
                  Date of Birth
                </TableHead>
                <TableHead>Programs</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedClients.length > 0 ? (
                paginatedClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">
                      {client.firstName} {client.lastName}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {client.contactNumber}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {format(client.dateOfBirth, "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {client.enrolledPrograms.length > 0 ? (
                          client.enrolledPrograms
                            .slice(0, 2)
                            .map((program: { id: Key | null | undefined; diseaseType: string; }) => (
                              <span key={program.id}>
                                {getProgramBadge(program.diseaseType)}
                              </span>
                            ))
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            None
                          </span>
                        )}
                        {client.enrolledPrograms.length > 2 && (
                          <Badge variant="outline" className="bg-muted">
                            +{client.enrolledPrograms.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {getStatusBadge(client.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => handleViewDetails(client)}
                          >
                            View details
                          </DropdownMenuItem>
                          <DropdownMenuItem>Edit client</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Enroll in program</DropdownMenuItem>
                          <DropdownMenuItem>View history</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            Deactivate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No clients found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(startIndex + itemsPerPage, filteredClients.length)}
              </span>{" "}
              of <span className="font-medium">{filteredClients.length}</span>{" "}
              clients
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-muted/50 flex justify-between">
        <p className="text-sm text-muted-foreground">
          Health Information System
        </p>
        <p className="text-sm text-muted-foreground">Client Registry Module</p>
      </CardFooter>

      {/* Client Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Client Details</DialogTitle>
            <DialogDescription>
              Comprehensive information about the selected client.
            </DialogDescription>
          </DialogHeader>

          {selectedClient && (
            <>
              <Tabs defaultValue="info" className="mt-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="info">Personal Info</TabsTrigger>
                  <TabsTrigger value="programs">Programs</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                <TabsContent value="info" className="space-y-4 mt-4">
                  <div className="flex items-center justify-center mb-6">
                    <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                      <UserCircle className="h-16 w-16 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Full Name
                      </p>
                      <p>
                        {selectedClient.firstName} {selectedClient.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Date of Birth
                      </p>
                      <p>
                        {format(selectedClient.dateOfBirth, "MMMM d, yyyy")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Gender
                      </p>
                      <p className="capitalize">{selectedClient.gender}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Status
                      </p>
                      <p>{getStatusBadge(selectedClient.status)}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Contact Number
                      </p>
                      <p>{selectedClient.contactNumber}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Address
                      </p>
                      <p>{selectedClient.address}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="programs" className="space-y-4 mt-4">
                  {selectedClient.enrolledPrograms.length > 0 ? (
                    <div className="space-y-4">
                      {selectedClient.enrolledPrograms.map((program: { id: Key | null | undefined; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; diseaseType: string; enrollmentDate: number | Date; }) => (
                        <Card key={program.id}>
                          <CardHeader className="py-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base font-medium">
                                {program.name}
                              </CardTitle>
                              {getProgramBadge(program.diseaseType)}
                            </div>
                          </CardHeader>
                          <CardContent className="py-2">
                            <p className="text-sm text-muted-foreground">
                              Enrolled on{" "}
                              {format(program.enrollmentDate, "MMMM d, yyyy")}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        Not enrolled in any programs
                      </p>
                      <Button className="mt-4 bg-green-600 hover:bg-green-700">
                        Enroll in Program
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="history" className="mt-4">
                  <div className="space-y-4">
                    <div className="border-l-2 border-muted pl-4 py-2">
                      <p className="text-sm text-muted-foreground">
                        {format(new Date("2023-03-15"), "MMM d, yyyy")}
                      </p>
                      <p className="font-medium">Client record created</p>
                    </div>
                    {selectedClient.enrolledPrograms.map((program: { id: Key | null | undefined; enrollmentDate: number | Date; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; diseaseType: string; }) => (
                      <div
                        key={program.id}
                        className="border-l-2 border-muted pl-4 py-2"
                      >
                        <p className="text-sm text-muted-foreground">
                          {format(program.enrollmentDate, "MMM d, yyyy")}
                        </p>
                        <p className="font-medium">
                          Enrolled in {program.name}{" "}
                          {getProgramBadge(program.diseaseType)}
                        </p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
              <div className="flex justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={() => setIsDetailsOpen(false)}
                >
                  Close
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  Edit Client
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
