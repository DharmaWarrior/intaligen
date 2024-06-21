import React, { useState } from 'react';
import {
  ArchiveX,
  ClipboardCheck,
  ArrowUpFromLine,
  Trash2,
  ClipboardPlus,
  FileText,
  MoreVertical,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./../../components/ui/table"
import AddForm from './AddForm';
import { Button } from "./../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./../../components/ui/dropdown-menu";
import { Separator } from "./../../components/ui/separator";
import { Textarea } from "./../../components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "./../../components/ui/tooltip";
import { ScrollArea } from './../../components/ui/scroll-area';
import BatchDetailsDialog from '.././cards/BatchDetailsDialog';
import EditOrderDialog from './../cards/EditOrderDialog.jsx';

export function MailDisplay({ mail, onDeleteMail, setCurrentTab, fetchOrders, currentStatus, onMarkActive, handleSelectMail}) {
  
  const [activeTab, setActiveTab] = useState('Orders');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expandedBatchId, setExpandedBatchId] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [addBatchDialogOpen, setAddBatchDialogOpen] = useState(false);
  const [editTable, setEditTable] = useState(false);
  const [editOrderDialogOpen, setEditOrderDialogOpen] = useState(false);
  const [editedOrderData, setEditedOrderData] = useState(null); 

  if (mail) {
    var id = mail.orderId;
    
  }

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  


  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleBatchView = (batch) => {
    setSelectedBatch(batch);
    setDialogOpen(true);
  };
  
  const formFields = [
    { name: 'Batch_Name', label: 'Batch Name', type: 'text', required: true },
    { name: 'Date', label: 'Date', type: 'date', required: true },
  ];
  

  const handleAddBatch = async (formData) => {
    // Implement the logic to handle adding a new batch
    try {
      let token = localStorage.getItem("usersdatatoken");
      const response = await fetch('/api/add_delivery_batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({
          batch_name: formData.Batch_Name,
          desp_date: formData.Date,
          order_id : id,
        }),
      });

      if (response.ok) {
        console.log('Batch added successfully');
        setDialogOpen(false);
        setCurrentTab('Active');
        fetchOrders('Active');
        handleSelectMail(id);
        
      } else {
        alert('Failed to add batch');
      }
    } catch (error) {
      console.error('Error adding batch:', error);
      alert('Error adding batch');
    }
  };

  const handleAddBatchDialogOpen = () => {
    setAddBatchDialogOpen(true);
  };
  const handleAddBatchDialogClose = () => {
    setAddBatchDialogOpen(false);
  };

  const handleEditOrder = () => {
    setEditedOrderData(mail); // Assuming `id` is the order ID
    setEditOrderDialogOpen(true);
  };

  
  
  const handleSaveChanges = async (formData) => {
    // Implement the logic to save changes
    console.log(formData);
    
    try {
      let token = localStorage.getItem("usersdatatoken");
      const response = await fetch('/api/bulkentry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({ 
          "add_items_check": "YES",
          "chart_id" : id,
          "order_note": formData.order_info.note,
          "despdate": formData.order_info.despdate,
          "items_ids[]": formData.order_data_df.map((item) => item.id?.toString()),
          "items_qtys[]": formData.order_data_df.map((item) => item.order_qty),
          "item_units[]": formData.order_data_df.map((item) => item.item_unit),
          "chart_items_ids[]": formData.order_data_df.map((item) => item.order_item_id ? item.order_item_id.toString() : -1),
          "add_type": "bulk",
         }),
      });

      if (response.ok) {
        console.log('Order updated successfully');
        setEditOrderDialogOpen(false);
        fetchOrders(currentStatus);
        setCurrentTab(currentStatus);
        handleSelectMail(id);
        
      } else {
        alert('Failed to update order');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Error updating order');
    }
  }



  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center p-2">
        <div className="flex items-center gap-2">
          {currentStatus === 'Active' && (
            <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" disabled={!mail}>
                  <ArchiveX className="h-4 w-4" />
                  <span className="sr-only">Decline Order</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Decline Order</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" disabled={!mail} onClick={() => mail && onMarkActive(id)}>
                  <ClipboardCheck className="h-4 w-4" />
                  <span className="sr-only">Mark As Complete</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Mark As Complete</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" disabled={!mail}>
                  <ArrowUpFromLine className="h-4 w-4" />
                  <span className="sr-only">Push Invoice To Finance</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Push Invoice To Finance</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={!mail}
                  onClick={() => mail && onDeleteMail(id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete Order</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete Order</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" disabled={!mail}>
                  <FileText className="h-4 w-4" />
                  <span className="sr-only">Order Sheet PDF</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Order Sheet PDF</TooltipContent>
            </Tooltip>
          </>
          )}
          {currentStatus === 'Pending' && (
            <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" disabled={!mail}>
                  <ClipboardCheck className="h-4 w-4" />
                  <span className="sr-only">Approve Order</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Approve Order</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" disabled={!mail}>
                  <ArrowUpFromLine className="h-4 w-4" />
                  <span className="sr-only">Push Invoice To Finance</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Push Invoice To Finance</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={!mail}
                  onClick={() => mail && onDeleteMail(id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete Order</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete Order</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" disabled={!mail}>
                  <FileText className="h-4 w-4" />
                  <span className="sr-only">Order Sheet PDF</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Order Sheet PDF</TooltipContent>
            </Tooltip>
          </>
          )}
          {currentStatus === 'Dispatched' && (
            <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" disabled={!mail}>
                  <ArrowUpFromLine className="h-4 w-4" />
                  <span className="sr-only">Push Invoice To Finance</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Push Invoice To Finance</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" disabled={!mail}>
                  <ClipboardPlus className="h-4 w-4" />
                  <span className="sr-only">Add Balance Order</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add Balance Order</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" disabled={!mail}>
                  <FileText className="h-4 w-4" />
                  <span className="sr-only">Order Sheet PDF</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Order Sheet PDF</TooltipContent>
            </Tooltip>
          </>
          )}
          
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Separator orientation="vertical" className="mx-2 h-6" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!mail}>
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>#</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Separator />
      {mail ? (
        <div className="flex flex-1 flex-col">
          <div className="flex items-start p-4">
            <div className="flex items-start gap-4 text-sm">
              <div className="grid gap-1">
                <div className="font-semibold text-4xl mb-2">{mail.orders_data[id].customer.name}</div>
                <div className="line-clamp-1 text-xl mb-2">{mail.orders_data[id].order.note}</div>
                <div className="line-clamp-1 text-xs mb-2">
                  <span className="text-blue-600 font-semibold">{mail.orders_data[id].order.regdate}</span>{' << '}
                  <span className="text-red-600 font-semibold">{mail.orders_data[id].order.despdate}</span>
                </div>
              </div>
            </div>
            {mail.orders_data[id].order.status && (
              <div className="ml-auto text-xl border rounded border-black p-2 text-muted-foreground">
                {mail.orders_data[id].order.status}
              </div>
            )}
          </div>
          <Separator />
          <div className="flex-1 whitespace-pre-wrap p-4 text-sm">
            <div className="flex  border-b-2 border-gray-200 items-center justify-between">
              <div>
                <button
                  className={`py-2 px-4 ${activeTab === 'Orders' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('Orders')}
                >
                  Orders
                </button>
                {currentStatus !== 'Pending' && (
                  <button
                  className={`py-2 px-4 ${activeTab === 'Dispatch' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('Dispatch')}
                >
                  Dispatch
                </button>
                )}
                <button
                  className={`py-2 px-4 ${activeTab === 'Documents' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('Documents')}
                >
                  Documents
                </button>
            </div>
            {activeTab === 'Dispatch' && currentStatus === 'Active' && (
                <Button variant="secondary" size="sm" onClick={handleAddBatchDialogOpen}>
                  Add Batch
                </Button>
              )}
            {activeTab === 'Orders' && (currentStatus === 'Pending' || currentStatus === 'Active') && (
                <Button variant="secondary" size="sm" onClick={handleEditOrder}>
                  Edit Order
                </Button>
              )}
            </div>

            {activeTab === 'Orders' && mail.order_data_df && (
              <Table className="min-w-full bg-white">
                <TableHeader>
                  <TableRow>
                    <TableHead className="py-2 px-4 bg-gray-100 border-b">ITEM NAME</TableHead>
                    <TableHead className="py-2 px-4 bg-gray-100 border-b">ORDERED</TableHead>
                    <TableHead className="py-2 px-4 bg-gray-100 border-b">UNIT</TableHead>
                    <TableHead className="py-2 px-4 bg-gray-100 border-b">FULFILLED</TableHead>
                    <TableHead className="py-2 px-4 bg-gray-100 border-b">BALANCE</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mail.order_data_df.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="py-2 px-4 border-b">{item.item_name}</TableCell>
                      <TableCell className="py-2 px-4 border-b">{item.order_qty}</TableCell>
                      <TableCell className="py-2 px-4 border-b">{item.item_unit}</TableCell>
                      <TableCell className="py-2 px-4 border-b">{item.order_qty - item.balance_qty}</TableCell>
                      <TableCell className="py-2 px-4 border-b">{item.balance_qty}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {activeTab === 'Dispatch' && mail.orders_data && mail.orders_data[id] && mail.orders_data[id].order && mail.orders_data[id].order.deliverybatches && (
              <ScrollArea className="h-[300px]">
              <div className="min-w-full bg-white py-4 ">
                {mail.orders_data[id].order.deliverybatches.map((batch, index) => (
                  <div key={index} className="flex flex-col rounded-lg border border-1 border-solid border-gray-200 p-3 text-left text-sm transition-all hover:bg-accent">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-2xl">{batch.batch_name}</div>
                        <div className="text-gray-600">{batch.actual_desp_date}{' | '}</div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleBatchView(batch.id)}>
                        {expandedBatchId === batch.id ? 'Cancel' : 'View'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              </ScrollArea>
            )}
            {activeTab === 'Documents' && <Textarea />}
          </div>
          <Separator className="mt-auto" />
          <BatchDetailsDialog isOpen={dialogOpen} onClose={handleDialogClose} batch={selectedBatch} mail={mail} />
          <AddForm
            open={addBatchDialogOpen}
            handleClose={handleAddBatchDialogClose}
            handleFormSubmit={handleAddBatch}
            formFields={formFields}
            title="Add New Batch"
          />
          <EditOrderDialog
            isOpen={editOrderDialogOpen}
            handleClose={() => setEditOrderDialogOpen(false)}
            orderData={mail}
            handleSave={handleSaveChanges} // Implement handleSaveChanges function
          />
        </div>
      ) : (
        <div className="p-8 text-center text-muted-foreground">No message selected</div>
      )}
    </div>
  );
}