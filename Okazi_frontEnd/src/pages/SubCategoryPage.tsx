import { Button, Form, Table } from "react-bootstrap";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import DropDownCategory from "../components/DropDownCategory";
import { useEffect, useState } from "react";
import axios from "axios";

interface SubCategories {
  subCategoryId: number;
  name: string;
  categoryId: number;
}

// interface Category {
//   name: string;
// }

function SubCategoryPage() {
  const [subCategories, setSubCategories] = useState<SubCategories[]>([]);
  const [selectedCategory, setSelectedcategory] = useState<number | null>(null);

  const [currentView, setCurrentView] = useState("Create");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get<SubCategories[]>(
        "http://localhost:8080/v1/subcategories/all"
      );
      setSubCategories(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching subcategories", error);
    }
  };

  const handleCategoryChange = (id: number) => {
    console.log("category selected:", id);
    setSelectedcategory(id);
  };

  // event.target.value
  const handleSubCategorySubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const subCategoryName = (
      event.currentTarget.elements.namedItem(
        "subcategoryName"
      ) as HTMLInputElement
    )?.value;

    console.log("Subcategory name:", subCategoryName);
    console.log("slected category:", selectedCategory);
    if (selectedCategory === null) {
      console.error("No category selected");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/v1/subcategories/create",
        {
          name: subCategoryName,
          categoryId: selectedCategory,
        }
      );

      console.log("subcategory created succesfully", response.data);
      fetchData();
    } catch (error) {
      console.error("error creating subcategory", error);
    }
  };

  const handleDeleteSubCategories = async (subCategoryId: number) => {
    console.log("SubCategory Id to Delete", subCategoryId);
    try {
      await axios.delete(
        `http://localhost:8080/v1/subcategories/${subCategoryId}`
      );
      console.log("SubCategory deleted succesfully");
      fetchData();
    } catch (error) {
      console.log("Error deleting SubCategory", error);
      console.log(subCategoryId);
    }
  };

  const renderSubCategoryPage = () => {
    switch (currentView) {
      case "List":
        return (
          <div>
            <h2>fix the delete (bad request)</h2>
            <Table bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Subcategorie naam</th>

                  <th>Action buttons</th>
                </tr>
              </thead>
              <tbody>
                {subCategories.map((subCategory, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{subCategory.name}</td>
                    <td>
                      <Button
                        variant="danger"
                        onClick={() => {
                          handleDeleteSubCategories(subCategory.subCategoryId);
                          setCurrentView("List");
                        }}
                      >
                        verwijder
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Button onClick={() => setCurrentView("Create")}>
              Maak een nieuwe SubCategorie
            </Button>
          </div>
        );
      case "Create":
        return (
          <div>
            <Form onSubmit={handleSubCategorySubmit}>
              <Form.Group controlId="subcategoryName">
                <Form.Label>Subcategory Name:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter subcategory name"
                />
              </Form.Group>
              <Form.Group controlId="categorySelect">
                <Form.Label>Select Category:</Form.Label>
                <DropDownCategory
                  onSelect={handleCategoryChange}
                ></DropDownCategory>
              </Form.Group>
              <Button variant="primary" type="submit">
                Create Subcategory
              </Button>
              <Button variant="primary" onClick={() => setCurrentView("List")}>
                Lijst zien ^^
              </Button>
            </Form>
            <Link to={"/"}>
              <Button variant="primary">Terug</Button>
            </Link>
          </div>
        );
    }
  };

  return (
    <div>
      <Navbar
        home="Home"
        navItem2="Categories"
        navItem3="SubCategories"
        navItem4="Locaties"
        navItem5="Overzicht"
        rightCorner="Profiel"
      ></Navbar>
      <h1>SubCategory</h1>
      <div id="container">
        <p>check https://react.dev/learn/passing-props-to-a-component aub </p>
        {renderSubCategoryPage()}
      </div>
    </div>
  );
}

export default SubCategoryPage;
