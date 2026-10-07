<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index(Request $request)
    {
        $query = Service::query();

        if ($category = $request->input('category')) {
            $query->where('category', $category);
        }

        if ($request->has('is_active')) {
            $query->where('is_active', filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN));
        }

        $services = $query->orderBy('category', 'asc')->orderBy('price', 'asc')->get();

        return response()->json($services);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|in:kiloan,satuan',
            'unit' => 'required|string|max:20',
            'price' => 'required|numeric|min:0',
            'estimated_hours' => 'required|integer|min:1',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $service = Service::create($validated);

        return response()->json([
            'message' => 'Layanan berhasil ditambahkan',
            'service' => $service,
        ], 201);
    }

    public function show($id)
    {
        $service = Service::findOrFail($id);

        return response()->json($service);
    }

    public function update(Request $request, $id)
    {
        $service = Service::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|in:kiloan,satuan',
            'unit' => 'required|string|max:20',
            'price' => 'required|numeric|min:0',
            'estimated_hours' => 'required|integer|min:1',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $service->update($validated);

        return response()->json([
            'message' => 'Layanan berhasil diperbarui',
            'service' => $service,
        ]);
    }

    public function destroy($id)
    {
        $service = Service::findOrFail($id);
        $service->delete();

        return response()->json([
            'message' => 'Layanan berhasil dihapus',
        ]);
    }
}

